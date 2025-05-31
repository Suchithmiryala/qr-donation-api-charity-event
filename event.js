import {
  SwaggerListResponse,
  SwaggerResponse,
  populatedSchema,
} from '../model/response.js';
import { EventModel } from '../model/event.js';
import { CharityModel } from '../model/user.js';

export default function (fastify, opts, done) {
  fastify.post(
    '/event',
    {
      onRequest: [fastify.authCharity],
      schema: {
        description: 'Create an event',
        tags: ['Event'],
        security: [{ Bearer: [] }],
        body: {
          properties: {
            name: {
              type: 'string',
              default: 'Swinburne, Hawthorn, Melbourne',
            },
            description: {
              type: 'string',
              default: 'Event description',
            },
            logo: {
              type: 'string',
            },
          },
        },
        ...SwaggerResponse(EventModel, {
          charity: populatedSchema(CharityModel),
        }),
      },
    },
    async (req, rep) => {
      let charityId = req.user.uuid;

      let event = await EventModel.create({
        charity: charityId,
        ...req.body,
      });

      rep.send(event);
    }
  );

  fastify.get(
    '/event/list',
    {
      onRequest: [fastify.authCharity],
      schema: {
        description: 'Get all events',
        tags: ['Event'],
        security: [{ Bearer: [] }],
        query: {
          skip: { type: 'number', default: fastify.apiDefaultValue.skip },
          size: { type: 'number', default: fastify.apiDefaultValue.limit },
        },
        ...SwaggerListResponse(EventModel, {
          charity: populatedSchema(CharityModel),
        }),
      },
    },
    async (req, rep) => {
      let charityId = req.user.uuid;

      let eventList = await EventModel.find({
        charity: charityId,
      })
        .skip(req.query.skip)
        .limit(req.query.size);

      rep.send(eventList.reverse());
    }
  );

  fastify.get(
    '/event/:eventId',
    {
      schema: {
        description: 'Get an event',
        tags: ['Event'],
        params: {
          eventId: {
            type: 'string',
            default: fastify.apiDefaultValue.eventId,
          },
        },
        ...SwaggerResponse(EventModel, {
          charity: populatedSchema(CharityModel),
        }),
      },
    },
    async (req, rep) => {
      let event = await EventModel.findById(req.params.eventId);

      if (event == null) {
        throw createHttpError.NotFound('Event Not found');
      }

      rep.send(event);
    }
  );

  done();
}
