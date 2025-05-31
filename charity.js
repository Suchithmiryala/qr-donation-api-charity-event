import { SwaggerResponse, SwaggerListResponse } from '../model/response.js';
import { CharityModel, UserModel } from '../model/user.js';
import { convertEnumToSwaggerSchema, UserRole } from '../model/enum.js';
import createHttpError from 'http-errors';

export default function (fastify, opts, done) {
  fastify.get(
    '/charity/:charityId',
    {
      schema: {
        description: 'Get charity profile',
        tags: ['Charity'],
        params: {
          charityId: {
            type: 'string',
            default: fastify.apiDefaultValue.charityId,
          },
        },
        ...SwaggerResponse(CharityModel),
      },
    },
    async (req, rep) => {
      let charityId = req.params.charityId;

      let charity = await CharityModel.findById(charityId);

      if (charity == null) {
        throw createHttpError.NotFound(`Charity: ${charityId} Not found`);
      }

      rep.send(charity);
    }
  );

  fastify.get(
    '/charity/list',
    {
      onRequest: [fastify.authAdmin],
      schema: {
        security: [{ Bearer: [] }],
        description: 'Get charity list',
        tags: ['Charity'],
        query: {
          skip: { type: 'number', default: fastify.apiDefaultValue.skip },
          size: { type: 'number', default: fastify.apiDefaultValue.limit },
        },
        ...SwaggerListResponse(CharityModel),
      },
    },
    async (req, rep) => {
      let charityList = await CharityModel.find({
        role: UserRole.charity,
      })
        .sort({ created_at: -1 })
        .skip(req.query.skip)
        .limit(req.query.size);

      rep.send(charityList);
    }
  );

  fastify.post(
    '/charity',
    {
      onRequest: [fastify.authCharity],
      schema: {
        description: 'Update charity profile',
        security: [{ Bearer: [] }],
        tags: ['Charity'],
        body: {
          properties: {
            logo: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          },
        },
        ...SwaggerResponse(CharityModel),
      },
    },
    async (req, rep) => {
      let charityId = req.user.uuid;

      let charity = await CharityModel.findOneAndUpdate(
        { _id: charityId },
        { ...req.body },
        { new: true }
      );

      if (charity == null) {
        throw createHttpError.NotFound(`Charity: ${charityId} Not found`);
      }

      rep.send(charity);
    }
  );

  done();
}
