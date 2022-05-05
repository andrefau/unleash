import { createSchemaObject, CreateSchemaType } from '../types';
import { featureSchema } from './feature-schema';

//Add operation
const addOperationSchema = {
    type: 'object',
    required: ['path', 'op', 'value'],
    properties: {
        path: {
            type: 'string',
        },
        op: {
            type: 'string',
            enum: ['add'],
        },
        value: featureSchema,
    },
} as const;

export type PatchFeatureAddOperationSchema = CreateSchemaType<
    typeof addOperationSchema
>;
export const patchFeatureAddOperationSchema =
    createSchemaObject(addOperationSchema);

//Remove operation
const removeOperationSchema = {
    type: 'object',
    required: ['path', 'op'],
    properties: {
        path: {
            type: 'string',
        },
        op: {
            type: 'string',
            enum: ['remove'],
        },
    },
} as const;

export type PatchFeatureRemoveOperationSchema = CreateSchemaType<
    typeof removeOperationSchema
>;
export const patchFeatureRemoveOperationSchema = createSchemaObject(
    removeOperationSchema,
);

//Replace Operation
const replaceOperationSchema = {
    type: 'object',
    required: ['path', 'op', 'value'],
    properties: {
        path: {
            type: 'string',
        },
        op: {
            type: 'string',
            enum: ['replace'],
        },
        value: featureSchema,
    },
} as const;

export type PatchFeatureReplaceOperationSchema = CreateSchemaType<
    typeof replaceOperationSchema
>;
export const patchFeatureReplaceOperationSchema = createSchemaObject(
    replaceOperationSchema,
);

//Move Operation
const moveOperationSchema = {
    type: 'object',
    properties: {
        path: {
            type: 'string',
        },
        op: {
            type: 'string',
            enum: ['move'],
        },
        from: {
            type: 'string',
        },
    },
} as const;

export type PatchFeatureMoveOperationSchema = CreateSchemaType<
    typeof moveOperationSchema
>;
export const patchFeatureMoveOperationSchema =
    createSchemaObject(moveOperationSchema);

//Copy Operation
const copyOperationSchema = {
    type: 'object',
    properties: {
        path: {
            type: 'string',
        },
        op: {
            type: 'string',
            enum: ['copy'],
        },
        from: {
            type: 'string',
        },
    },
} as const;

export type PatchFeatureCopyOperationSchema = CreateSchemaType<
    typeof copyOperationSchema
>;
export const patchFeatureCopyOperationSchema =
    createSchemaObject(copyOperationSchema);

//Test Operation
const testOperationSchema = {
    type: 'object',
    properties: {
        path: {
            type: 'string',
        },
        op: {
            type: 'string',
            enum: ['test'],
        },
        value: featureSchema,
    },
} as const;

export type PatchFeatureTestOperationSchema = CreateSchemaType<
    typeof testOperationSchema
>;
export const patchFeatureTestOperationSchema =
    createSchemaObject(testOperationSchema);

//Get Operation
const getOperationSchema = {
    type: 'object',
    required: ['path', 'op'],
    properties: {
        path: {
            type: 'string',
        },
        op: {
            type: 'string',
            enum: ['_get'],
        },
        value: featureSchema,
    },
} as const;

export type PatchFeatureGetOperationSchema = CreateSchemaType<
    typeof getOperationSchema
>;
export const patchFeatureGetOperationSchema =
    createSchemaObject(getOperationSchema);

const schema = {
    type: 'object',
    oneOf: [
        patchFeatureAddOperationSchema,
        patchFeatureRemoveOperationSchema,
        patchFeatureReplaceOperationSchema,
        patchFeatureMoveOperationSchema,
        patchFeatureCopyOperationSchema,
        patchFeatureTestOperationSchema,
        patchFeatureGetOperationSchema,
    ],
    discriminator: {
        propertyName: 'op',
    },
} as const;

export type PatchFeatureOperationSchema = CreateSchemaType<typeof schema>;

export const patchFeatureOperationSchema = createSchemaObject(schema);