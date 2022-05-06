import { OpenAPIV3 } from 'openapi-types';
import { featuresSchema } from './spec/features-schema';
import { overrideSchema } from './spec/override-schema';
import { strategySchema } from './spec/strategy-schema';
import { variantSchema } from './spec/variant-schema';
import { createFeatureSchema } from './spec/create-feature-schema';
import { constraintSchema } from './spec/constraint-schema';
import { tagSchema } from './spec/tag-schema';
import { tagsSchema } from './spec/tags-schema';
import { strategiesSchema } from './spec/strategies-schema';
import { createStrategySchema } from './spec/create-strategy-schema';
import { featureSchema } from './spec/feature-schema';
import { parametersSchema } from './spec/parameters-schema';
import { featureEnvironmentInfoSchema } from './spec/feature-environment-info-schema';
import { emptyResponseSchema } from './spec/empty-response-schema';
import {
    patchAddOperationSchema,
    patchCopyOperationSchema,
    patchMoveOperationSchema,
    patchOperationSchema,
    patchRemoveOperationSchema,
    patchReplaceOperationSchema,
} from './spec/patch-operation-schema';
import { updateFeatureSchema } from './spec/updateFeatureSchema';
import { updateStrategySchema } from './spec/update-strategy-schema';
import { patchSchema } from './spec/patch-schema';
import { cloneFeatureSchema } from './spec/clone-feature-schema';

export const createOpenApiSchema = (
    serverUrl?: string,
): Omit<OpenAPIV3.Document, 'paths'> => {
    return {
        openapi: '3.0.3',
        servers: serverUrl ? [{ url: serverUrl }] : [],
        info: {
            title: 'Unleash API',
            version: process.env.npm_package_version,
        },
        security: [
            {
                apiKey: [],
            },
        ],
        components: {
            securitySchemes: {
                apiKey: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                },
            },
            schemas: {
                constraintSchema,
                cloneFeatureSchema,
                createFeatureSchema,
                createStrategySchema,
                featureSchema,
                featuresSchema,
                featureEnvironmentInfoSchema,
                emptyResponseSchema,
                overrideSchema,
                parametersSchema,
                patchAddOperationSchema,
                patchRemoveOperationSchema,
                patchReplaceOperationSchema,
                patchMoveOperationSchema,
                patchOperationSchema,
                patchCopyOperationSchema,
                patchSchema,
                strategySchema,
                strategiesSchema,
                updateStrategySchema,
                updateFeatureSchema,
                variantSchema,
                tagSchema,
                tagsSchema,
            },
        },
    };
};
