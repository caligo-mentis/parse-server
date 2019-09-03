"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "extractKeysAndInclude", {
  enumerable: true,
  get: function () {
    return _parseGraphQLUtils.extractKeysAndInclude;
  }
});
exports.load = void 0;

var _graphql = require("graphql");

var _graphqlListFields = _interopRequireDefault(require("graphql-list-fields"));

var defaultGraphQLTypes = _interopRequireWildcard(require("./defaultGraphQLTypes"));

var objectsQueries = _interopRequireWildcard(require("../helpers/objectsQueries"));

var _ParseGraphQLController = require("../../Controllers/ParseGraphQLController");

var _className = require("../transformers/className");

var _inputType = require("../transformers/inputType");

var _outputType = require("../transformers/outputType");

var _constraintType = require("../transformers/constraintType");

var _parseGraphQLUtils = require("../parseGraphQLUtils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getParseClassTypeConfig = function (parseClassConfig) {
  return parseClassConfig && parseClassConfig.type || {};
};

const getInputFieldsAndConstraints = function (parseClass, parseClassConfig) {
  const classFields = Object.keys(parseClass.fields).filter(field => field !== 'objectId').concat('id');
  const {
    inputFields: allowedInputFields,
    outputFields: allowedOutputFields,
    constraintFields: allowedConstraintFields,
    sortFields: allowedSortFields
  } = getParseClassTypeConfig(parseClassConfig);
  let classOutputFields;
  let classCreateFields;
  let classUpdateFields;
  let classConstraintFields;
  let classSortFields; // All allowed customs fields

  const classCustomFields = classFields.filter(field => {
    return !Object.keys(defaultGraphQLTypes.PARSE_OBJECT_FIELDS).includes(field);
  });

  if (allowedInputFields && allowedInputFields.create) {
    classCreateFields = classCustomFields.filter(field => {
      return allowedInputFields.create.includes(field);
    });
  } else {
    classCreateFields = classCustomFields;
  }

  if (allowedInputFields && allowedInputFields.update) {
    classUpdateFields = classCustomFields.filter(field => {
      return allowedInputFields.update.includes(field);
    });
  } else {
    classUpdateFields = classCustomFields;
  }

  if (allowedOutputFields) {
    classOutputFields = classCustomFields.filter(field => {
      return allowedOutputFields.includes(field);
    });
  } else {
    classOutputFields = classCustomFields;
  } // Filters the "password" field from class _User


  if (parseClass.className === '_User') {
    classOutputFields = classOutputFields.filter(outputField => outputField !== 'password');
  }

  if (allowedConstraintFields) {
    classConstraintFields = classCustomFields.filter(field => {
      return allowedConstraintFields.includes(field);
    });
  } else {
    classConstraintFields = classFields;
  }

  if (allowedSortFields) {
    classSortFields = allowedSortFields;

    if (!classSortFields.length) {
      // must have at least 1 order field
      // otherwise the FindArgs Input Type will throw.
      classSortFields.push({
        field: 'id',
        asc: true,
        desc: true
      });
    }
  } else {
    classSortFields = classFields.map(field => {
      return {
        field,
        asc: true,
        desc: true
      };
    });
  }

  return {
    classCreateFields,
    classUpdateFields,
    classConstraintFields,
    classOutputFields,
    classSortFields
  };
};

const load = (parseGraphQLSchema, parseClass, parseClassConfig) => {
  const className = parseClass.className;
  const graphQLClassName = (0, _className.transformClassNameToGraphQL)(className);
  const {
    classCreateFields,
    classUpdateFields,
    classOutputFields,
    classConstraintFields,
    classSortFields
  } = getInputFieldsAndConstraints(parseClass, parseClassConfig);
  const {
    create: isCreateEnabled = true,
    update: isUpdateEnabled = true
  } = (0, _parseGraphQLUtils.getParseClassMutationConfig)(parseClassConfig);
  const classGraphQLScalarTypeName = `${graphQLClassName}Pointer`;

  const parseScalarValue = value => {
    if (typeof value === 'string') {
      return {
        __type: 'Pointer',
        className: className,
        objectId: value
      };
    } else if (typeof value === 'object' && value.__type === 'Pointer' && value.className === className && typeof value.objectId === 'string') {
      return _objectSpread({}, value, {
        className
      });
    }

    throw new defaultGraphQLTypes.TypeValidationError(value, classGraphQLScalarTypeName);
  };

  let classGraphQLScalarType = new _graphql.GraphQLScalarType({
    name: classGraphQLScalarTypeName,
    description: `The ${classGraphQLScalarTypeName} is used in operations that involve ${graphQLClassName} pointers.`,
    parseValue: parseScalarValue,

    serialize(value) {
      if (typeof value === 'string') {
        return value;
      } else if (typeof value === 'object' && value.__type === 'Pointer' && value.className === className && typeof value.objectId === 'string') {
        return value.objectId;
      }

      throw new defaultGraphQLTypes.TypeValidationError(value, classGraphQLScalarTypeName);
    },

    parseLiteral(ast) {
      if (ast.kind === _graphql.Kind.STRING) {
        return parseScalarValue(ast.value);
      } else if (ast.kind === _graphql.Kind.OBJECT) {
        const __type = ast.fields.find(field => field.name.value === '__type');

        const className = ast.fields.find(field => field.name.value === 'className');
        const objectId = ast.fields.find(field => field.name.value === 'objectId');

        if (__type && __type.value && className && className.value && objectId && objectId.value) {
          return parseScalarValue({
            __type: __type.value.value,
            className: className.value.value,
            objectId: objectId.value.value
          });
        }
      }

      throw new defaultGraphQLTypes.TypeValidationError(ast.kind, classGraphQLScalarTypeName);
    }

  });
  classGraphQLScalarType = parseGraphQLSchema.addGraphQLType(classGraphQLScalarType) || defaultGraphQLTypes.OBJECT;
  const classGraphQLCreateTypeName = `Create${graphQLClassName}FieldsInput`;
  let classGraphQLCreateType = new _graphql.GraphQLInputObjectType({
    name: classGraphQLCreateTypeName,
    description: `The ${classGraphQLCreateTypeName} input type is used in operations that involve creation of objects in the ${graphQLClassName} class.`,
    fields: () => classCreateFields.reduce((fields, field) => {
      const type = (0, _inputType.transformInputTypeToGraphQL)(parseClass.fields[field].type, parseClass.fields[field].targetClass, parseGraphQLSchema.parseClassTypes);

      if (type) {
        return _objectSpread({}, fields, {
          [field]: {
            description: `This is the object ${field}.`,
            type
          }
        });
      } else {
        return fields;
      }
    }, {
      ACL: defaultGraphQLTypes.ACL_ATT
    })
  });
  classGraphQLCreateType = parseGraphQLSchema.addGraphQLType(classGraphQLCreateType);
  const classGraphQLUpdateTypeName = `Update${graphQLClassName}FieldsInput`;
  let classGraphQLUpdateType = new _graphql.GraphQLInputObjectType({
    name: classGraphQLUpdateTypeName,
    description: `The ${classGraphQLUpdateTypeName} input type is used in operations that involve creation of objects in the ${graphQLClassName} class.`,
    fields: () => classUpdateFields.reduce((fields, field) => {
      const type = (0, _inputType.transformInputTypeToGraphQL)(parseClass.fields[field].type, parseClass.fields[field].targetClass, parseGraphQLSchema.parseClassTypes);

      if (type) {
        return _objectSpread({}, fields, {
          [field]: {
            description: `This is the object ${field}.`,
            type
          }
        });
      } else {
        return fields;
      }
    }, {
      ACL: defaultGraphQLTypes.ACL_ATT
    })
  });
  classGraphQLUpdateType = parseGraphQLSchema.addGraphQLType(classGraphQLUpdateType);
  const classGraphQLPointerTypeName = `${graphQLClassName}PointerInput`;
  let classGraphQLPointerType = new _graphql.GraphQLInputObjectType({
    name: classGraphQLPointerTypeName,
    description: `Allow to link OR add and link an object of the ${graphQLClassName} class.`,
    fields: () => {
      const fields = {
        link: {
          description: `Link an existing object from ${graphQLClassName} class.`,
          type: _graphql.GraphQLID
        }
      };

      if (isCreateEnabled) {
        fields['createAndLink'] = {
          description: `Create and link an object from ${graphQLClassName} class.`,
          type: classGraphQLCreateType
        };
      }

      return fields;
    }
  });
  classGraphQLPointerType = parseGraphQLSchema.addGraphQLType(classGraphQLPointerType) || defaultGraphQLTypes.OBJECT;
  const classGraphQLRelationTypeName = `${graphQLClassName}RelationInput`;
  let classGraphQLRelationType = new _graphql.GraphQLInputObjectType({
    name: classGraphQLRelationTypeName,
    description: `Allow to add, remove, createAndAdd objects of the ${graphQLClassName} class into a relation field.`,
    fields: () => {
      const fields = {
        add: {
          description: `Add an existing object from the ${graphQLClassName} class into the relation.`,
          type: new _graphql.GraphQLList(defaultGraphQLTypes.OBJECT_ID)
        },
        remove: {
          description: `Remove an existing object from the ${graphQLClassName} class out of the relation.`,
          type: new _graphql.GraphQLList(defaultGraphQLTypes.OBJECT_ID)
        }
      };

      if (isCreateEnabled) {
        fields['createAndAdd'] = {
          description: `Create and add an object of the ${graphQLClassName} class into the relation.`,
          type: new _graphql.GraphQLList(new _graphql.GraphQLNonNull(classGraphQLCreateType))
        };
      }

      return fields;
    }
  });
  classGraphQLRelationType = parseGraphQLSchema.addGraphQLType(classGraphQLRelationType) || defaultGraphQLTypes.OBJECT;
  const classGraphQLConstraintTypeName = `${graphQLClassName}PointerWhereInput`;
  let classGraphQLConstraintType = new _graphql.GraphQLInputObjectType({
    name: classGraphQLConstraintTypeName,
    description: `The ${classGraphQLConstraintTypeName} input type is used in operations that involve filtering objects by a pointer field to ${graphQLClassName} class.`,
    fields: {
      _eq: defaultGraphQLTypes._eq(classGraphQLScalarType),
      _ne: defaultGraphQLTypes._ne(classGraphQLScalarType),
      _in: defaultGraphQLTypes._in(classGraphQLScalarType),
      _nin: defaultGraphQLTypes._nin(classGraphQLScalarType),
      _exists: defaultGraphQLTypes._exists,
      _select: defaultGraphQLTypes._select,
      _dontSelect: defaultGraphQLTypes._dontSelect,
      _inQuery: {
        description: 'This is the $inQuery operator to specify a constraint to select the objects where a field equals to any of the ids in the result of a different query.',
        type: defaultGraphQLTypes.SUBQUERY_INPUT
      },
      _notInQuery: {
        description: 'This is the $notInQuery operator to specify a constraint to select the objects where a field do not equal to any of the ids in the result of a different query.',
        type: defaultGraphQLTypes.SUBQUERY_INPUT
      }
    }
  });
  classGraphQLConstraintType = parseGraphQLSchema.addGraphQLType(classGraphQLConstraintType);
  const classGraphQLConstraintsTypeName = `${graphQLClassName}WhereInput`;
  let classGraphQLConstraintsType = new _graphql.GraphQLInputObjectType({
    name: classGraphQLConstraintsTypeName,
    description: `The ${classGraphQLConstraintsTypeName} input type is used in operations that involve filtering objects of ${graphQLClassName} class.`,
    fields: () => _objectSpread({}, classConstraintFields.reduce((fields, field) => {
      const parseField = field === 'id' ? 'objectId' : field;
      const type = (0, _constraintType.transformConstraintTypeToGraphQL)(parseClass.fields[parseField].type, parseClass.fields[parseField].targetClass, parseGraphQLSchema.parseClassTypes);

      if (type) {
        return _objectSpread({}, fields, {
          [field]: {
            description: `This is the object ${field}.`,
            type
          }
        });
      } else {
        return fields;
      }
    }, {}), {
      _or: {
        description: 'This is the $or operator to compound constraints.',
        type: new _graphql.GraphQLList(new _graphql.GraphQLNonNull(classGraphQLConstraintsType))
      },
      _and: {
        description: 'This is the $and operator to compound constraints.',
        type: new _graphql.GraphQLList(new _graphql.GraphQLNonNull(classGraphQLConstraintsType))
      },
      _nor: {
        description: 'This is the $nor operator to compound constraints.',
        type: new _graphql.GraphQLList(new _graphql.GraphQLNonNull(classGraphQLConstraintsType))
      }
    })
  });
  classGraphQLConstraintsType = parseGraphQLSchema.addGraphQLType(classGraphQLConstraintsType) || defaultGraphQLTypes.OBJECT;
  const classGraphQLOrderTypeName = `${graphQLClassName}Order`;
  let classGraphQLOrderType = new _graphql.GraphQLEnumType({
    name: classGraphQLOrderTypeName,
    description: `The ${classGraphQLOrderTypeName} input type is used when sorting objects of the ${graphQLClassName} class.`,
    values: classSortFields.reduce((sortFields, fieldConfig) => {
      const {
        field,
        asc,
        desc
      } = fieldConfig;

      const updatedSortFields = _objectSpread({}, sortFields);

      if (asc) {
        updatedSortFields[`${field}_ASC`] = {
          value: field
        };
      }

      if (desc) {
        updatedSortFields[`${field}_DESC`] = {
          value: `-${field}`
        };
      }

      return updatedSortFields;
    }, {})
  });
  classGraphQLOrderType = parseGraphQLSchema.addGraphQLType(classGraphQLOrderType);
  const classGraphQLFindArgs = {
    where: {
      description: 'These are the conditions that the objects need to match in order to be found.',
      type: classGraphQLConstraintsType
    },
    order: {
      description: 'The fields to be used when sorting the data fetched.',
      type: classGraphQLOrderType ? new _graphql.GraphQLList(new _graphql.GraphQLNonNull(classGraphQLOrderType)) : _graphql.GraphQLString
    },
    skip: defaultGraphQLTypes.SKIP_ATT,
    limit: defaultGraphQLTypes.LIMIT_ATT,
    readPreference: defaultGraphQLTypes.READ_PREFERENCE_ATT,
    includeReadPreference: defaultGraphQLTypes.INCLUDE_READ_PREFERENCE_ATT,
    subqueryReadPreference: defaultGraphQLTypes.SUBQUERY_READ_PREFERENCE_ATT
  };
  const classGraphQLOutputTypeName = `${graphQLClassName}`;

  const outputFields = () => {
    return classOutputFields.reduce((fields, field) => {
      const type = (0, _outputType.transformOutputTypeToGraphQL)(parseClass.fields[field].type, parseClass.fields[field].targetClass, parseGraphQLSchema.parseClassTypes);

      if (parseClass.fields[field].type === 'Relation') {
        const targetParseClassTypes = parseGraphQLSchema.parseClassTypes[parseClass.fields[field].targetClass];
        const args = targetParseClassTypes ? targetParseClassTypes.classGraphQLFindArgs : undefined;
        return _objectSpread({}, fields, {
          [field]: {
            description: `This is the object ${field}.`,
            args,
            type,

            async resolve(source, args, context, queryInfo) {
              try {
                const {
                  where,
                  order,
                  skip,
                  limit,
                  readPreference,
                  includeReadPreference,
                  subqueryReadPreference
                } = args;
                const {
                  config,
                  auth,
                  info
                } = context;
                const selectedFields = (0, _graphqlListFields.default)(queryInfo);
                const {
                  keys,
                  include
                } = (0, _parseGraphQLUtils.extractKeysAndInclude)(selectedFields.filter(field => field.includes('.')).map(field => field.slice(field.indexOf('.') + 1)));
                return await objectsQueries.findObjects(source[field].className, _objectSpread({
                  _relatedTo: {
                    object: {
                      __type: 'Pointer',
                      className: className,
                      objectId: source.objectId
                    },
                    key: field
                  }
                }, where || {}), order, skip, limit, keys, include, false, readPreference, includeReadPreference, subqueryReadPreference, config, auth, info, selectedFields.map(field => field.split('.', 1)[0]));
              } catch (e) {
                parseGraphQLSchema.handleError(e);
              }
            }

          }
        });
      } else if (parseClass.fields[field].type === 'Polygon') {
        return _objectSpread({}, fields, {
          [field]: {
            description: `This is the object ${field}.`,
            type,

            async resolve(source) {
              if (source[field] && source[field].coordinates) {
                return source[field].coordinates.map(coordinate => ({
                  latitude: coordinate[0],
                  longitude: coordinate[1]
                }));
              } else {
                return null;
              }
            }

          }
        });
      } else if (parseClass.fields[field].type === 'Array') {
        return _objectSpread({}, fields, {
          [field]: {
            description: `Use Inline Fragment on Array to get results: https://graphql.org/learn/queries/#inline-fragments`,
            type,

            async resolve(source) {
              if (!source[field]) return null;
              return source[field].map(async elem => {
                if (elem.className && elem.objectId && elem.__type === 'Object') {
                  return elem;
                } else {
                  return {
                    value: elem
                  };
                }
              });
            }

          }
        });
      } else if (type) {
        return _objectSpread({}, fields, {
          [field]: {
            description: `This is the object ${field}.`,
            type
          }
        });
      } else {
        return fields;
      }
    }, defaultGraphQLTypes.PARSE_OBJECT_FIELDS);
  };

  let classGraphQLOutputType = new _graphql.GraphQLObjectType({
    name: classGraphQLOutputTypeName,
    description: `The ${classGraphQLOutputTypeName} object type is used in operations that involve outputting objects of ${graphQLClassName} class.`,
    interfaces: [defaultGraphQLTypes.PARSE_OBJECT],
    fields: outputFields
  });
  classGraphQLOutputType = parseGraphQLSchema.addGraphQLType(classGraphQLOutputType);
  const classGraphQLFindResultTypeName = `${graphQLClassName}FindResult`;
  let classGraphQLFindResultType = new _graphql.GraphQLObjectType({
    name: classGraphQLFindResultTypeName,
    description: `The ${classGraphQLFindResultTypeName} object type is used in the ${graphQLClassName} find query to return the data of the matched objects.`,
    fields: {
      results: {
        description: 'This is the objects returned by the query',
        type: new _graphql.GraphQLNonNull(new _graphql.GraphQLList(new _graphql.GraphQLNonNull(classGraphQLOutputType || defaultGraphQLTypes.OBJECT)))
      },
      count: defaultGraphQLTypes.COUNT_ATT
    }
  });
  classGraphQLFindResultType = parseGraphQLSchema.addGraphQLType(classGraphQLFindResultType);
  parseGraphQLSchema.parseClassTypes[className] = {
    classGraphQLPointerType,
    classGraphQLRelationType,
    classGraphQLScalarType,
    classGraphQLCreateType,
    classGraphQLUpdateType,
    classGraphQLConstraintType,
    classGraphQLConstraintsType,
    classGraphQLFindArgs,
    classGraphQLOutputType,
    classGraphQLFindResultType,
    config: {
      parseClassConfig,
      isCreateEnabled,
      isUpdateEnabled
    }
  };

  if (className === '_User') {
    const viewerType = new _graphql.GraphQLObjectType({
      name: 'Viewer',
      description: `The Viewer object type is used in operations that involve outputting the current user data.`,
      interfaces: [defaultGraphQLTypes.PARSE_OBJECT],
      fields: () => _objectSpread({}, outputFields(), {
        sessionToken: defaultGraphQLTypes.SESSION_TOKEN_ATT
      })
    });
    parseGraphQLSchema.viewerType = viewerType;
    parseGraphQLSchema.addGraphQLType(viewerType, true, true);
    const userSignUpInputTypeName = 'SignUpFieldsInput';
    const userSignUpInputType = new _graphql.GraphQLInputObjectType({
      name: userSignUpInputTypeName,
      description: `The ${userSignUpInputTypeName} input type is used in operations that involve inputting objects of ${graphQLClassName} class when signing up.`,
      fields: () => classCreateFields.reduce((fields, field) => {
        const type = (0, _inputType.transformInputTypeToGraphQL)(parseClass.fields[field].type, parseClass.fields[field].targetClass, parseGraphQLSchema.parseClassTypes);

        if (type) {
          return _objectSpread({}, fields, {
            [field]: {
              description: `This is the object ${field}.`,
              type: field === 'username' || field === 'password' ? new _graphql.GraphQLNonNull(type) : type
            }
          });
        } else {
          return fields;
        }
      }, {})
    });
    parseGraphQLSchema.addGraphQLType(userSignUpInputType, true, true);
    const userLogInInputTypeName = 'LogInFieldsInput';
    const userLogInInputType = new _graphql.GraphQLInputObjectType({
      name: userLogInInputTypeName,
      description: `The ${userLogInInputTypeName} input type is used to login.`,
      fields: {
        username: {
          description: 'This is the username used to log the user in.',
          type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
        },
        password: {
          description: 'This is the password used to log the user in.',
          type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
        }
      }
    });
    parseGraphQLSchema.addGraphQLType(userLogInInputType, true, true);
    parseGraphQLSchema.parseClassTypes[className].signUpInputType = userSignUpInputType;
    parseGraphQLSchema.parseClassTypes[className].logInInputType = userLogInInputType;
  }
};

exports.load = load;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HcmFwaFFML2xvYWRlcnMvcGFyc2VDbGFzc1R5cGVzLmpzIl0sIm5hbWVzIjpbImdldFBhcnNlQ2xhc3NUeXBlQ29uZmlnIiwicGFyc2VDbGFzc0NvbmZpZyIsInR5cGUiLCJnZXRJbnB1dEZpZWxkc0FuZENvbnN0cmFpbnRzIiwicGFyc2VDbGFzcyIsImNsYXNzRmllbGRzIiwiT2JqZWN0Iiwia2V5cyIsImZpZWxkcyIsImZpbHRlciIsImZpZWxkIiwiY29uY2F0IiwiaW5wdXRGaWVsZHMiLCJhbGxvd2VkSW5wdXRGaWVsZHMiLCJvdXRwdXRGaWVsZHMiLCJhbGxvd2VkT3V0cHV0RmllbGRzIiwiY29uc3RyYWludEZpZWxkcyIsImFsbG93ZWRDb25zdHJhaW50RmllbGRzIiwic29ydEZpZWxkcyIsImFsbG93ZWRTb3J0RmllbGRzIiwiY2xhc3NPdXRwdXRGaWVsZHMiLCJjbGFzc0NyZWF0ZUZpZWxkcyIsImNsYXNzVXBkYXRlRmllbGRzIiwiY2xhc3NDb25zdHJhaW50RmllbGRzIiwiY2xhc3NTb3J0RmllbGRzIiwiY2xhc3NDdXN0b21GaWVsZHMiLCJkZWZhdWx0R3JhcGhRTFR5cGVzIiwiUEFSU0VfT0JKRUNUX0ZJRUxEUyIsImluY2x1ZGVzIiwiY3JlYXRlIiwidXBkYXRlIiwiY2xhc3NOYW1lIiwib3V0cHV0RmllbGQiLCJsZW5ndGgiLCJwdXNoIiwiYXNjIiwiZGVzYyIsIm1hcCIsImxvYWQiLCJwYXJzZUdyYXBoUUxTY2hlbWEiLCJncmFwaFFMQ2xhc3NOYW1lIiwiaXNDcmVhdGVFbmFibGVkIiwiaXNVcGRhdGVFbmFibGVkIiwiY2xhc3NHcmFwaFFMU2NhbGFyVHlwZU5hbWUiLCJwYXJzZVNjYWxhclZhbHVlIiwidmFsdWUiLCJfX3R5cGUiLCJvYmplY3RJZCIsIlR5cGVWYWxpZGF0aW9uRXJyb3IiLCJjbGFzc0dyYXBoUUxTY2FsYXJUeXBlIiwiR3JhcGhRTFNjYWxhclR5cGUiLCJuYW1lIiwiZGVzY3JpcHRpb24iLCJwYXJzZVZhbHVlIiwic2VyaWFsaXplIiwicGFyc2VMaXRlcmFsIiwiYXN0Iiwia2luZCIsIktpbmQiLCJTVFJJTkciLCJPQkpFQ1QiLCJmaW5kIiwiYWRkR3JhcGhRTFR5cGUiLCJjbGFzc0dyYXBoUUxDcmVhdGVUeXBlTmFtZSIsImNsYXNzR3JhcGhRTENyZWF0ZVR5cGUiLCJHcmFwaFFMSW5wdXRPYmplY3RUeXBlIiwicmVkdWNlIiwidGFyZ2V0Q2xhc3MiLCJwYXJzZUNsYXNzVHlwZXMiLCJBQ0wiLCJBQ0xfQVRUIiwiY2xhc3NHcmFwaFFMVXBkYXRlVHlwZU5hbWUiLCJjbGFzc0dyYXBoUUxVcGRhdGVUeXBlIiwiY2xhc3NHcmFwaFFMUG9pbnRlclR5cGVOYW1lIiwiY2xhc3NHcmFwaFFMUG9pbnRlclR5cGUiLCJsaW5rIiwiR3JhcGhRTElEIiwiY2xhc3NHcmFwaFFMUmVsYXRpb25UeXBlTmFtZSIsImNsYXNzR3JhcGhRTFJlbGF0aW9uVHlwZSIsImFkZCIsIkdyYXBoUUxMaXN0IiwiT0JKRUNUX0lEIiwicmVtb3ZlIiwiR3JhcGhRTE5vbk51bGwiLCJjbGFzc0dyYXBoUUxDb25zdHJhaW50VHlwZU5hbWUiLCJjbGFzc0dyYXBoUUxDb25zdHJhaW50VHlwZSIsIl9lcSIsIl9uZSIsIl9pbiIsIl9uaW4iLCJfZXhpc3RzIiwiX3NlbGVjdCIsIl9kb250U2VsZWN0IiwiX2luUXVlcnkiLCJTVUJRVUVSWV9JTlBVVCIsIl9ub3RJblF1ZXJ5IiwiY2xhc3NHcmFwaFFMQ29uc3RyYWludHNUeXBlTmFtZSIsImNsYXNzR3JhcGhRTENvbnN0cmFpbnRzVHlwZSIsInBhcnNlRmllbGQiLCJfb3IiLCJfYW5kIiwiX25vciIsImNsYXNzR3JhcGhRTE9yZGVyVHlwZU5hbWUiLCJjbGFzc0dyYXBoUUxPcmRlclR5cGUiLCJHcmFwaFFMRW51bVR5cGUiLCJ2YWx1ZXMiLCJmaWVsZENvbmZpZyIsInVwZGF0ZWRTb3J0RmllbGRzIiwiY2xhc3NHcmFwaFFMRmluZEFyZ3MiLCJ3aGVyZSIsIm9yZGVyIiwiR3JhcGhRTFN0cmluZyIsInNraXAiLCJTS0lQX0FUVCIsImxpbWl0IiwiTElNSVRfQVRUIiwicmVhZFByZWZlcmVuY2UiLCJSRUFEX1BSRUZFUkVOQ0VfQVRUIiwiaW5jbHVkZVJlYWRQcmVmZXJlbmNlIiwiSU5DTFVERV9SRUFEX1BSRUZFUkVOQ0VfQVRUIiwic3VicXVlcnlSZWFkUHJlZmVyZW5jZSIsIlNVQlFVRVJZX1JFQURfUFJFRkVSRU5DRV9BVFQiLCJjbGFzc0dyYXBoUUxPdXRwdXRUeXBlTmFtZSIsInRhcmdldFBhcnNlQ2xhc3NUeXBlcyIsImFyZ3MiLCJ1bmRlZmluZWQiLCJyZXNvbHZlIiwic291cmNlIiwiY29udGV4dCIsInF1ZXJ5SW5mbyIsImNvbmZpZyIsImF1dGgiLCJpbmZvIiwic2VsZWN0ZWRGaWVsZHMiLCJpbmNsdWRlIiwic2xpY2UiLCJpbmRleE9mIiwib2JqZWN0c1F1ZXJpZXMiLCJmaW5kT2JqZWN0cyIsIl9yZWxhdGVkVG8iLCJvYmplY3QiLCJrZXkiLCJzcGxpdCIsImUiLCJoYW5kbGVFcnJvciIsImNvb3JkaW5hdGVzIiwiY29vcmRpbmF0ZSIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiZWxlbSIsImNsYXNzR3JhcGhRTE91dHB1dFR5cGUiLCJHcmFwaFFMT2JqZWN0VHlwZSIsImludGVyZmFjZXMiLCJQQVJTRV9PQkpFQ1QiLCJjbGFzc0dyYXBoUUxGaW5kUmVzdWx0VHlwZU5hbWUiLCJjbGFzc0dyYXBoUUxGaW5kUmVzdWx0VHlwZSIsInJlc3VsdHMiLCJjb3VudCIsIkNPVU5UX0FUVCIsInZpZXdlclR5cGUiLCJzZXNzaW9uVG9rZW4iLCJTRVNTSU9OX1RPS0VOX0FUVCIsInVzZXJTaWduVXBJbnB1dFR5cGVOYW1lIiwidXNlclNpZ25VcElucHV0VHlwZSIsInVzZXJMb2dJbklucHV0VHlwZU5hbWUiLCJ1c2VyTG9nSW5JbnB1dFR5cGUiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwic2lnblVwSW5wdXRUeXBlIiwibG9nSW5JbnB1dFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7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QUFDdUIsY0FBbkIsQ0FBa0N1RyxrQkFBbEMsRUFBc0QsSUFBdEQsRUFBNEQsSUFBNUQ7QUFFQTlILElBQUFBLGtCQUFrQixDQUFDNkIsZUFBbkIsQ0FDRXJDLFNBREYsRUFFRXlJLGVBRkYsR0FFb0JMLG1CQUZwQjtBQUdBNUgsSUFBQUEsa0JBQWtCLENBQUM2QixlQUFuQixDQUNFckMsU0FERixFQUVFMEksY0FGRixHQUVtQkosa0JBRm5CO0FBR0Q7QUFDRixDQTVqQkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBLaW5kLFxuICBHcmFwaFFMSUQsXG4gIEdyYXBoUUxPYmplY3RUeXBlLFxuICBHcmFwaFFMU3RyaW5nLFxuICBHcmFwaFFMTGlzdCxcbiAgR3JhcGhRTElucHV0T2JqZWN0VHlwZSxcbiAgR3JhcGhRTE5vbk51bGwsXG4gIEdyYXBoUUxTY2FsYXJUeXBlLFxuICBHcmFwaFFMRW51bVR5cGUsXG59IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IGdldEZpZWxkTmFtZXMgZnJvbSAnZ3JhcGhxbC1saXN0LWZpZWxkcyc7XG5pbXBvcnQgKiBhcyBkZWZhdWx0R3JhcGhRTFR5cGVzIGZyb20gJy4vZGVmYXVsdEdyYXBoUUxUeXBlcyc7XG5pbXBvcnQgKiBhcyBvYmplY3RzUXVlcmllcyBmcm9tICcuLi9oZWxwZXJzL29iamVjdHNRdWVyaWVzJztcbmltcG9ydCB7IFBhcnNlR3JhcGhRTENsYXNzQ29uZmlnIH0gZnJvbSAnLi4vLi4vQ29udHJvbGxlcnMvUGFyc2VHcmFwaFFMQ29udHJvbGxlcic7XG5pbXBvcnQgeyB0cmFuc2Zvcm1DbGFzc05hbWVUb0dyYXBoUUwgfSBmcm9tICcuLi90cmFuc2Zvcm1lcnMvY2xhc3NOYW1lJztcbmltcG9ydCB7IHRyYW5zZm9ybUlucHV0VHlwZVRvR3JhcGhRTCB9IGZyb20gJy4uL3RyYW5zZm9ybWVycy9pbnB1dFR5cGUnO1xuaW1wb3J0IHsgdHJhbnNmb3JtT3V0cHV0VHlwZVRvR3JhcGhRTCB9IGZyb20gJy4uL3RyYW5zZm9ybWVycy9vdXRwdXRUeXBlJztcbmltcG9ydCB7IHRyYW5zZm9ybUNvbnN0cmFpbnRUeXBlVG9HcmFwaFFMIH0gZnJvbSAnLi4vdHJhbnNmb3JtZXJzL2NvbnN0cmFpbnRUeXBlJztcbmltcG9ydCB7XG4gIGV4dHJhY3RLZXlzQW5kSW5jbHVkZSxcbiAgZ2V0UGFyc2VDbGFzc011dGF0aW9uQ29uZmlnLFxufSBmcm9tICcuLi9wYXJzZUdyYXBoUUxVdGlscyc7XG5cbmNvbnN0IGdldFBhcnNlQ2xhc3NUeXBlQ29uZmlnID0gZnVuY3Rpb24oXG4gIHBhcnNlQ2xhc3NDb25maWc6ID9QYXJzZUdyYXBoUUxDbGFzc0NvbmZpZ1xuKSB7XG4gIHJldHVybiAocGFyc2VDbGFzc0NvbmZpZyAmJiBwYXJzZUNsYXNzQ29uZmlnLnR5cGUpIHx8IHt9O1xufTtcblxuY29uc3QgZ2V0SW5wdXRGaWVsZHNBbmRDb25zdHJhaW50cyA9IGZ1bmN0aW9uKFxuICBwYXJzZUNsYXNzLFxuICBwYXJzZUNsYXNzQ29uZmlnOiA/UGFyc2VHcmFwaFFMQ2xhc3NDb25maWdcbikge1xuICBjb25zdCBjbGFzc0ZpZWxkcyA9IE9iamVjdC5rZXlzKHBhcnNlQ2xhc3MuZmllbGRzKVxuICAgIC5maWx0ZXIoZmllbGQgPT4gZmllbGQgIT09ICdvYmplY3RJZCcpXG4gICAgLmNvbmNhdCgnaWQnKTtcbiAgY29uc3Qge1xuICAgIGlucHV0RmllbGRzOiBhbGxvd2VkSW5wdXRGaWVsZHMsXG4gICAgb3V0cHV0RmllbGRzOiBhbGxvd2VkT3V0cHV0RmllbGRzLFxuICAgIGNvbnN0cmFpbnRGaWVsZHM6IGFsbG93ZWRDb25zdHJhaW50RmllbGRzLFxuICAgIHNvcnRGaWVsZHM6IGFsbG93ZWRTb3J0RmllbGRzLFxuICB9ID0gZ2V0UGFyc2VDbGFzc1R5cGVDb25maWcocGFyc2VDbGFzc0NvbmZpZyk7XG5cbiAgbGV0IGNsYXNzT3V0cHV0RmllbGRzO1xuICBsZXQgY2xhc3NDcmVhdGVGaWVsZHM7XG4gIGxldCBjbGFzc1VwZGF0ZUZpZWxkcztcbiAgbGV0IGNsYXNzQ29uc3RyYWludEZpZWxkcztcbiAgbGV0IGNsYXNzU29ydEZpZWxkcztcblxuICAvLyBBbGwgYWxsb3dlZCBjdXN0b21zIGZpZWxkc1xuICBjb25zdCBjbGFzc0N1c3RvbUZpZWxkcyA9IGNsYXNzRmllbGRzLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgcmV0dXJuICFPYmplY3Qua2V5cyhkZWZhdWx0R3JhcGhRTFR5cGVzLlBBUlNFX09CSkVDVF9GSUVMRFMpLmluY2x1ZGVzKFxuICAgICAgZmllbGRcbiAgICApO1xuICB9KTtcblxuICBpZiAoYWxsb3dlZElucHV0RmllbGRzICYmIGFsbG93ZWRJbnB1dEZpZWxkcy5jcmVhdGUpIHtcbiAgICBjbGFzc0NyZWF0ZUZpZWxkcyA9IGNsYXNzQ3VzdG9tRmllbGRzLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgICByZXR1cm4gYWxsb3dlZElucHV0RmllbGRzLmNyZWF0ZS5pbmNsdWRlcyhmaWVsZCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2xhc3NDcmVhdGVGaWVsZHMgPSBjbGFzc0N1c3RvbUZpZWxkcztcbiAgfVxuICBpZiAoYWxsb3dlZElucHV0RmllbGRzICYmIGFsbG93ZWRJbnB1dEZpZWxkcy51cGRhdGUpIHtcbiAgICBjbGFzc1VwZGF0ZUZpZWxkcyA9IGNsYXNzQ3VzdG9tRmllbGRzLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgICByZXR1cm4gYWxsb3dlZElucHV0RmllbGRzLnVwZGF0ZS5pbmNsdWRlcyhmaWVsZCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2xhc3NVcGRhdGVGaWVsZHMgPSBjbGFzc0N1c3RvbUZpZWxkcztcbiAgfVxuXG4gIGlmIChhbGxvd2VkT3V0cHV0RmllbGRzKSB7XG4gICAgY2xhc3NPdXRwdXRGaWVsZHMgPSBjbGFzc0N1c3RvbUZpZWxkcy5maWx0ZXIoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIGFsbG93ZWRPdXRwdXRGaWVsZHMuaW5jbHVkZXMoZmllbGQpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNsYXNzT3V0cHV0RmllbGRzID0gY2xhc3NDdXN0b21GaWVsZHM7XG4gIH1cbiAgLy8gRmlsdGVycyB0aGUgXCJwYXNzd29yZFwiIGZpZWxkIGZyb20gY2xhc3MgX1VzZXJcbiAgaWYgKHBhcnNlQ2xhc3MuY2xhc3NOYW1lID09PSAnX1VzZXInKSB7XG4gICAgY2xhc3NPdXRwdXRGaWVsZHMgPSBjbGFzc091dHB1dEZpZWxkcy5maWx0ZXIoXG4gICAgICBvdXRwdXRGaWVsZCA9PiBvdXRwdXRGaWVsZCAhPT0gJ3Bhc3N3b3JkJ1xuICAgICk7XG4gIH1cblxuICBpZiAoYWxsb3dlZENvbnN0cmFpbnRGaWVsZHMpIHtcbiAgICBjbGFzc0NvbnN0cmFpbnRGaWVsZHMgPSBjbGFzc0N1c3RvbUZpZWxkcy5maWx0ZXIoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIGFsbG93ZWRDb25zdHJhaW50RmllbGRzLmluY2x1ZGVzKGZpZWxkKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjbGFzc0NvbnN0cmFpbnRGaWVsZHMgPSBjbGFzc0ZpZWxkcztcbiAgfVxuXG4gIGlmIChhbGxvd2VkU29ydEZpZWxkcykge1xuICAgIGNsYXNzU29ydEZpZWxkcyA9IGFsbG93ZWRTb3J0RmllbGRzO1xuICAgIGlmICghY2xhc3NTb3J0RmllbGRzLmxlbmd0aCkge1xuICAgICAgLy8gbXVzdCBoYXZlIGF0IGxlYXN0IDEgb3JkZXIgZmllbGRcbiAgICAgIC8vIG90aGVyd2lzZSB0aGUgRmluZEFyZ3MgSW5wdXQgVHlwZSB3aWxsIHRocm93LlxuICAgICAgY2xhc3NTb3J0RmllbGRzLnB1c2goe1xuICAgICAgICBmaWVsZDogJ2lkJyxcbiAgICAgICAgYXNjOiB0cnVlLFxuICAgICAgICBkZXNjOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNsYXNzU29ydEZpZWxkcyA9IGNsYXNzRmllbGRzLm1hcChmaWVsZCA9PiB7XG4gICAgICByZXR1cm4geyBmaWVsZCwgYXNjOiB0cnVlLCBkZXNjOiB0cnVlIH07XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNsYXNzQ3JlYXRlRmllbGRzLFxuICAgIGNsYXNzVXBkYXRlRmllbGRzLFxuICAgIGNsYXNzQ29uc3RyYWludEZpZWxkcyxcbiAgICBjbGFzc091dHB1dEZpZWxkcyxcbiAgICBjbGFzc1NvcnRGaWVsZHMsXG4gIH07XG59O1xuXG5jb25zdCBsb2FkID0gKFxuICBwYXJzZUdyYXBoUUxTY2hlbWEsXG4gIHBhcnNlQ2xhc3MsXG4gIHBhcnNlQ2xhc3NDb25maWc6ID9QYXJzZUdyYXBoUUxDbGFzc0NvbmZpZ1xuKSA9PiB7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IHBhcnNlQ2xhc3MuY2xhc3NOYW1lO1xuICBjb25zdCBncmFwaFFMQ2xhc3NOYW1lID0gdHJhbnNmb3JtQ2xhc3NOYW1lVG9HcmFwaFFMKGNsYXNzTmFtZSk7XG4gIGNvbnN0IHtcbiAgICBjbGFzc0NyZWF0ZUZpZWxkcyxcbiAgICBjbGFzc1VwZGF0ZUZpZWxkcyxcbiAgICBjbGFzc091dHB1dEZpZWxkcyxcbiAgICBjbGFzc0NvbnN0cmFpbnRGaWVsZHMsXG4gICAgY2xhc3NTb3J0RmllbGRzLFxuICB9ID0gZ2V0SW5wdXRGaWVsZHNBbmRDb25zdHJhaW50cyhwYXJzZUNsYXNzLCBwYXJzZUNsYXNzQ29uZmlnKTtcblxuICBjb25zdCB7XG4gICAgY3JlYXRlOiBpc0NyZWF0ZUVuYWJsZWQgPSB0cnVlLFxuICAgIHVwZGF0ZTogaXNVcGRhdGVFbmFibGVkID0gdHJ1ZSxcbiAgfSA9IGdldFBhcnNlQ2xhc3NNdXRhdGlvbkNvbmZpZyhwYXJzZUNsYXNzQ29uZmlnKTtcblxuICBjb25zdCBjbGFzc0dyYXBoUUxTY2FsYXJUeXBlTmFtZSA9IGAke2dyYXBoUUxDbGFzc05hbWV9UG9pbnRlcmA7XG4gIGNvbnN0IHBhcnNlU2NhbGFyVmFsdWUgPSB2YWx1ZSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9fdHlwZTogJ1BvaW50ZXInLFxuICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZSxcbiAgICAgICAgb2JqZWN0SWQ6IHZhbHVlLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgICAgdmFsdWUuX190eXBlID09PSAnUG9pbnRlcicgJiZcbiAgICAgIHZhbHVlLmNsYXNzTmFtZSA9PT0gY2xhc3NOYW1lICYmXG4gICAgICB0eXBlb2YgdmFsdWUub2JqZWN0SWQgPT09ICdzdHJpbmcnXG4gICAgKSB7XG4gICAgICByZXR1cm4geyAuLi52YWx1ZSwgY2xhc3NOYW1lIH07XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IGRlZmF1bHRHcmFwaFFMVHlwZXMuVHlwZVZhbGlkYXRpb25FcnJvcihcbiAgICAgIHZhbHVlLFxuICAgICAgY2xhc3NHcmFwaFFMU2NhbGFyVHlwZU5hbWVcbiAgICApO1xuICB9O1xuICBsZXQgY2xhc3NHcmFwaFFMU2NhbGFyVHlwZSA9IG5ldyBHcmFwaFFMU2NhbGFyVHlwZSh7XG4gICAgbmFtZTogY2xhc3NHcmFwaFFMU2NhbGFyVHlwZU5hbWUsXG4gICAgZGVzY3JpcHRpb246IGBUaGUgJHtjbGFzc0dyYXBoUUxTY2FsYXJUeXBlTmFtZX0gaXMgdXNlZCBpbiBvcGVyYXRpb25zIHRoYXQgaW52b2x2ZSAke2dyYXBoUUxDbGFzc05hbWV9IHBvaW50ZXJzLmAsXG4gICAgcGFyc2VWYWx1ZTogcGFyc2VTY2FsYXJWYWx1ZSxcbiAgICBzZXJpYWxpemUodmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgdmFsdWUuX190eXBlID09PSAnUG9pbnRlcicgJiZcbiAgICAgICAgdmFsdWUuY2xhc3NOYW1lID09PSBjbGFzc05hbWUgJiZcbiAgICAgICAgdHlwZW9mIHZhbHVlLm9iamVjdElkID09PSAnc3RyaW5nJ1xuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5vYmplY3RJZDtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgbmV3IGRlZmF1bHRHcmFwaFFMVHlwZXMuVHlwZVZhbGlkYXRpb25FcnJvcihcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGNsYXNzR3JhcGhRTFNjYWxhclR5cGVOYW1lXG4gICAgICApO1xuICAgIH0sXG4gICAgcGFyc2VMaXRlcmFsKGFzdCkge1xuICAgICAgaWYgKGFzdC5raW5kID09PSBLaW5kLlNUUklORykge1xuICAgICAgICByZXR1cm4gcGFyc2VTY2FsYXJWYWx1ZShhc3QudmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChhc3Qua2luZCA9PT0gS2luZC5PQkpFQ1QpIHtcbiAgICAgICAgY29uc3QgX190eXBlID0gYXN0LmZpZWxkcy5maW5kKGZpZWxkID0+IGZpZWxkLm5hbWUudmFsdWUgPT09ICdfX3R5cGUnKTtcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gYXN0LmZpZWxkcy5maW5kKFxuICAgICAgICAgIGZpZWxkID0+IGZpZWxkLm5hbWUudmFsdWUgPT09ICdjbGFzc05hbWUnXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG9iamVjdElkID0gYXN0LmZpZWxkcy5maW5kKFxuICAgICAgICAgIGZpZWxkID0+IGZpZWxkLm5hbWUudmFsdWUgPT09ICdvYmplY3RJZCdcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIF9fdHlwZSAmJlxuICAgICAgICAgIF9fdHlwZS52YWx1ZSAmJlxuICAgICAgICAgIGNsYXNzTmFtZSAmJlxuICAgICAgICAgIGNsYXNzTmFtZS52YWx1ZSAmJlxuICAgICAgICAgIG9iamVjdElkICYmXG4gICAgICAgICAgb2JqZWN0SWQudmFsdWVcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlU2NhbGFyVmFsdWUoe1xuICAgICAgICAgICAgX190eXBlOiBfX3R5cGUudmFsdWUudmFsdWUsXG4gICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZS52YWx1ZS52YWx1ZSxcbiAgICAgICAgICAgIG9iamVjdElkOiBvYmplY3RJZC52YWx1ZS52YWx1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgZGVmYXVsdEdyYXBoUUxUeXBlcy5UeXBlVmFsaWRhdGlvbkVycm9yKFxuICAgICAgICBhc3Qua2luZCxcbiAgICAgICAgY2xhc3NHcmFwaFFMU2NhbGFyVHlwZU5hbWVcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG4gIGNsYXNzR3JhcGhRTFNjYWxhclR5cGUgPVxuICAgIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShjbGFzc0dyYXBoUUxTY2FsYXJUeXBlKSB8fFxuICAgIGRlZmF1bHRHcmFwaFFMVHlwZXMuT0JKRUNUO1xuXG4gIGNvbnN0IGNsYXNzR3JhcGhRTENyZWF0ZVR5cGVOYW1lID0gYENyZWF0ZSR7Z3JhcGhRTENsYXNzTmFtZX1GaWVsZHNJbnB1dGA7XG4gIGxldCBjbGFzc0dyYXBoUUxDcmVhdGVUeXBlID0gbmV3IEdyYXBoUUxJbnB1dE9iamVjdFR5cGUoe1xuICAgIG5hbWU6IGNsYXNzR3JhcGhRTENyZWF0ZVR5cGVOYW1lLFxuICAgIGRlc2NyaXB0aW9uOiBgVGhlICR7Y2xhc3NHcmFwaFFMQ3JlYXRlVHlwZU5hbWV9IGlucHV0IHR5cGUgaXMgdXNlZCBpbiBvcGVyYXRpb25zIHRoYXQgaW52b2x2ZSBjcmVhdGlvbiBvZiBvYmplY3RzIGluIHRoZSAke2dyYXBoUUxDbGFzc05hbWV9IGNsYXNzLmAsXG4gICAgZmllbGRzOiAoKSA9PlxuICAgICAgY2xhc3NDcmVhdGVGaWVsZHMucmVkdWNlKFxuICAgICAgICAoZmllbGRzLCBmaWVsZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSB0cmFuc2Zvcm1JbnB1dFR5cGVUb0dyYXBoUUwoXG4gICAgICAgICAgICBwYXJzZUNsYXNzLmZpZWxkc1tmaWVsZF0udHlwZSxcbiAgICAgICAgICAgIHBhcnNlQ2xhc3MuZmllbGRzW2ZpZWxkXS50YXJnZXRDbGFzcyxcbiAgICAgICAgICAgIHBhcnNlR3JhcGhRTFNjaGVtYS5wYXJzZUNsYXNzVHlwZXNcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5maWVsZHMsXG4gICAgICAgICAgICAgIFtmaWVsZF06IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYFRoaXMgaXMgdGhlIG9iamVjdCAke2ZpZWxkfS5gLFxuICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEFDTDogZGVmYXVsdEdyYXBoUUxUeXBlcy5BQ0xfQVRULFxuICAgICAgICB9XG4gICAgICApLFxuICB9KTtcbiAgY2xhc3NHcmFwaFFMQ3JlYXRlVHlwZSA9IHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShcbiAgICBjbGFzc0dyYXBoUUxDcmVhdGVUeXBlXG4gICk7XG5cbiAgY29uc3QgY2xhc3NHcmFwaFFMVXBkYXRlVHlwZU5hbWUgPSBgVXBkYXRlJHtncmFwaFFMQ2xhc3NOYW1lfUZpZWxkc0lucHV0YDtcbiAgbGV0IGNsYXNzR3JhcGhRTFVwZGF0ZVR5cGUgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gICAgbmFtZTogY2xhc3NHcmFwaFFMVXBkYXRlVHlwZU5hbWUsXG4gICAgZGVzY3JpcHRpb246IGBUaGUgJHtjbGFzc0dyYXBoUUxVcGRhdGVUeXBlTmFtZX0gaW5wdXQgdHlwZSBpcyB1c2VkIGluIG9wZXJhdGlvbnMgdGhhdCBpbnZvbHZlIGNyZWF0aW9uIG9mIG9iamVjdHMgaW4gdGhlICR7Z3JhcGhRTENsYXNzTmFtZX0gY2xhc3MuYCxcbiAgICBmaWVsZHM6ICgpID0+XG4gICAgICBjbGFzc1VwZGF0ZUZpZWxkcy5yZWR1Y2UoXG4gICAgICAgIChmaWVsZHMsIGZpZWxkKSA9PiB7XG4gICAgICAgICAgY29uc3QgdHlwZSA9IHRyYW5zZm9ybUlucHV0VHlwZVRvR3JhcGhRTChcbiAgICAgICAgICAgIHBhcnNlQ2xhc3MuZmllbGRzW2ZpZWxkXS50eXBlLFxuICAgICAgICAgICAgcGFyc2VDbGFzcy5maWVsZHNbZmllbGRdLnRhcmdldENsYXNzLFxuICAgICAgICAgICAgcGFyc2VHcmFwaFFMU2NoZW1hLnBhcnNlQ2xhc3NUeXBlc1xuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLmZpZWxkcyxcbiAgICAgICAgICAgICAgW2ZpZWxkXToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgVGhpcyBpcyB0aGUgb2JqZWN0ICR7ZmllbGR9LmAsXG4gICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgQUNMOiBkZWZhdWx0R3JhcGhRTFR5cGVzLkFDTF9BVFQsXG4gICAgICAgIH1cbiAgICAgICksXG4gIH0pO1xuICBjbGFzc0dyYXBoUUxVcGRhdGVUeXBlID0gcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKFxuICAgIGNsYXNzR3JhcGhRTFVwZGF0ZVR5cGVcbiAgKTtcblxuICBjb25zdCBjbGFzc0dyYXBoUUxQb2ludGVyVHlwZU5hbWUgPSBgJHtncmFwaFFMQ2xhc3NOYW1lfVBvaW50ZXJJbnB1dGA7XG4gIGxldCBjbGFzc0dyYXBoUUxQb2ludGVyVHlwZSA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgICBuYW1lOiBjbGFzc0dyYXBoUUxQb2ludGVyVHlwZU5hbWUsXG4gICAgZGVzY3JpcHRpb246IGBBbGxvdyB0byBsaW5rIE9SIGFkZCBhbmQgbGluayBhbiBvYmplY3Qgb2YgdGhlICR7Z3JhcGhRTENsYXNzTmFtZX0gY2xhc3MuYCxcbiAgICBmaWVsZHM6ICgpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkcyA9IHtcbiAgICAgICAgbGluazoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiBgTGluayBhbiBleGlzdGluZyBvYmplY3QgZnJvbSAke2dyYXBoUUxDbGFzc05hbWV9IGNsYXNzLmAsXG4gICAgICAgICAgdHlwZTogR3JhcGhRTElELFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIGlmIChpc0NyZWF0ZUVuYWJsZWQpIHtcbiAgICAgICAgZmllbGRzWydjcmVhdGVBbmRMaW5rJ10gPSB7XG4gICAgICAgICAgZGVzY3JpcHRpb246IGBDcmVhdGUgYW5kIGxpbmsgYW4gb2JqZWN0IGZyb20gJHtncmFwaFFMQ2xhc3NOYW1lfSBjbGFzcy5gLFxuICAgICAgICAgIHR5cGU6IGNsYXNzR3JhcGhRTENyZWF0ZVR5cGUsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRzO1xuICAgIH0sXG4gIH0pO1xuICBjbGFzc0dyYXBoUUxQb2ludGVyVHlwZSA9XG4gICAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKGNsYXNzR3JhcGhRTFBvaW50ZXJUeXBlKSB8fFxuICAgIGRlZmF1bHRHcmFwaFFMVHlwZXMuT0JKRUNUO1xuXG4gIGNvbnN0IGNsYXNzR3JhcGhRTFJlbGF0aW9uVHlwZU5hbWUgPSBgJHtncmFwaFFMQ2xhc3NOYW1lfVJlbGF0aW9uSW5wdXRgO1xuICBsZXQgY2xhc3NHcmFwaFFMUmVsYXRpb25UeXBlID0gbmV3IEdyYXBoUUxJbnB1dE9iamVjdFR5cGUoe1xuICAgIG5hbWU6IGNsYXNzR3JhcGhRTFJlbGF0aW9uVHlwZU5hbWUsXG4gICAgZGVzY3JpcHRpb246IGBBbGxvdyB0byBhZGQsIHJlbW92ZSwgY3JlYXRlQW5kQWRkIG9iamVjdHMgb2YgdGhlICR7Z3JhcGhRTENsYXNzTmFtZX0gY2xhc3MgaW50byBhIHJlbGF0aW9uIGZpZWxkLmAsXG4gICAgZmllbGRzOiAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZHMgPSB7XG4gICAgICAgIGFkZDoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiBgQWRkIGFuIGV4aXN0aW5nIG9iamVjdCBmcm9tIHRoZSAke2dyYXBoUUxDbGFzc05hbWV9IGNsYXNzIGludG8gdGhlIHJlbGF0aW9uLmAsXG4gICAgICAgICAgdHlwZTogbmV3IEdyYXBoUUxMaXN0KGRlZmF1bHRHcmFwaFFMVHlwZXMuT0JKRUNUX0lEKSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlOiB7XG4gICAgICAgICAgZGVzY3JpcHRpb246IGBSZW1vdmUgYW4gZXhpc3Rpbmcgb2JqZWN0IGZyb20gdGhlICR7Z3JhcGhRTENsYXNzTmFtZX0gY2xhc3Mgb3V0IG9mIHRoZSByZWxhdGlvbi5gLFxuICAgICAgICAgIHR5cGU6IG5ldyBHcmFwaFFMTGlzdChkZWZhdWx0R3JhcGhRTFR5cGVzLk9CSkVDVF9JRCksXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgaWYgKGlzQ3JlYXRlRW5hYmxlZCkge1xuICAgICAgICBmaWVsZHNbJ2NyZWF0ZUFuZEFkZCddID0ge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiBgQ3JlYXRlIGFuZCBhZGQgYW4gb2JqZWN0IG9mIHRoZSAke2dyYXBoUUxDbGFzc05hbWV9IGNsYXNzIGludG8gdGhlIHJlbGF0aW9uLmAsXG4gICAgICAgICAgdHlwZTogbmV3IEdyYXBoUUxMaXN0KG5ldyBHcmFwaFFMTm9uTnVsbChjbGFzc0dyYXBoUUxDcmVhdGVUeXBlKSksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRzO1xuICAgIH0sXG4gIH0pO1xuICBjbGFzc0dyYXBoUUxSZWxhdGlvblR5cGUgPVxuICAgIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShjbGFzc0dyYXBoUUxSZWxhdGlvblR5cGUpIHx8XG4gICAgZGVmYXVsdEdyYXBoUUxUeXBlcy5PQkpFQ1Q7XG5cbiAgY29uc3QgY2xhc3NHcmFwaFFMQ29uc3RyYWludFR5cGVOYW1lID0gYCR7Z3JhcGhRTENsYXNzTmFtZX1Qb2ludGVyV2hlcmVJbnB1dGA7XG4gIGxldCBjbGFzc0dyYXBoUUxDb25zdHJhaW50VHlwZSA9IG5ldyBHcmFwaFFMSW5wdXRPYmplY3RUeXBlKHtcbiAgICBuYW1lOiBjbGFzc0dyYXBoUUxDb25zdHJhaW50VHlwZU5hbWUsXG4gICAgZGVzY3JpcHRpb246IGBUaGUgJHtjbGFzc0dyYXBoUUxDb25zdHJhaW50VHlwZU5hbWV9IGlucHV0IHR5cGUgaXMgdXNlZCBpbiBvcGVyYXRpb25zIHRoYXQgaW52b2x2ZSBmaWx0ZXJpbmcgb2JqZWN0cyBieSBhIHBvaW50ZXIgZmllbGQgdG8gJHtncmFwaFFMQ2xhc3NOYW1lfSBjbGFzcy5gLFxuICAgIGZpZWxkczoge1xuICAgICAgX2VxOiBkZWZhdWx0R3JhcGhRTFR5cGVzLl9lcShjbGFzc0dyYXBoUUxTY2FsYXJUeXBlKSxcbiAgICAgIF9uZTogZGVmYXVsdEdyYXBoUUxUeXBlcy5fbmUoY2xhc3NHcmFwaFFMU2NhbGFyVHlwZSksXG4gICAgICBfaW46IGRlZmF1bHRHcmFwaFFMVHlwZXMuX2luKGNsYXNzR3JhcGhRTFNjYWxhclR5cGUpLFxuICAgICAgX25pbjogZGVmYXVsdEdyYXBoUUxUeXBlcy5fbmluKGNsYXNzR3JhcGhRTFNjYWxhclR5cGUpLFxuICAgICAgX2V4aXN0czogZGVmYXVsdEdyYXBoUUxUeXBlcy5fZXhpc3RzLFxuICAgICAgX3NlbGVjdDogZGVmYXVsdEdyYXBoUUxUeXBlcy5fc2VsZWN0LFxuICAgICAgX2RvbnRTZWxlY3Q6IGRlZmF1bHRHcmFwaFFMVHlwZXMuX2RvbnRTZWxlY3QsXG4gICAgICBfaW5RdWVyeToge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAnVGhpcyBpcyB0aGUgJGluUXVlcnkgb3BlcmF0b3IgdG8gc3BlY2lmeSBhIGNvbnN0cmFpbnQgdG8gc2VsZWN0IHRoZSBvYmplY3RzIHdoZXJlIGEgZmllbGQgZXF1YWxzIHRvIGFueSBvZiB0aGUgaWRzIGluIHRoZSByZXN1bHQgb2YgYSBkaWZmZXJlbnQgcXVlcnkuJyxcbiAgICAgICAgdHlwZTogZGVmYXVsdEdyYXBoUUxUeXBlcy5TVUJRVUVSWV9JTlBVVCxcbiAgICAgIH0sXG4gICAgICBfbm90SW5RdWVyeToge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAnVGhpcyBpcyB0aGUgJG5vdEluUXVlcnkgb3BlcmF0b3IgdG8gc3BlY2lmeSBhIGNvbnN0cmFpbnQgdG8gc2VsZWN0IHRoZSBvYmplY3RzIHdoZXJlIGEgZmllbGQgZG8gbm90IGVxdWFsIHRvIGFueSBvZiB0aGUgaWRzIGluIHRoZSByZXN1bHQgb2YgYSBkaWZmZXJlbnQgcXVlcnkuJyxcbiAgICAgICAgdHlwZTogZGVmYXVsdEdyYXBoUUxUeXBlcy5TVUJRVUVSWV9JTlBVVCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG4gIGNsYXNzR3JhcGhRTENvbnN0cmFpbnRUeXBlID0gcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKFxuICAgIGNsYXNzR3JhcGhRTENvbnN0cmFpbnRUeXBlXG4gICk7XG5cbiAgY29uc3QgY2xhc3NHcmFwaFFMQ29uc3RyYWludHNUeXBlTmFtZSA9IGAke2dyYXBoUUxDbGFzc05hbWV9V2hlcmVJbnB1dGA7XG4gIGxldCBjbGFzc0dyYXBoUUxDb25zdHJhaW50c1R5cGUgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gICAgbmFtZTogY2xhc3NHcmFwaFFMQ29uc3RyYWludHNUeXBlTmFtZSxcbiAgICBkZXNjcmlwdGlvbjogYFRoZSAke2NsYXNzR3JhcGhRTENvbnN0cmFpbnRzVHlwZU5hbWV9IGlucHV0IHR5cGUgaXMgdXNlZCBpbiBvcGVyYXRpb25zIHRoYXQgaW52b2x2ZSBmaWx0ZXJpbmcgb2JqZWN0cyBvZiAke2dyYXBoUUxDbGFzc05hbWV9IGNsYXNzLmAsXG4gICAgZmllbGRzOiAoKSA9PiAoe1xuICAgICAgLi4uY2xhc3NDb25zdHJhaW50RmllbGRzLnJlZHVjZSgoZmllbGRzLCBmaWVsZCkgPT4ge1xuICAgICAgICBjb25zdCBwYXJzZUZpZWxkID0gZmllbGQgPT09ICdpZCcgPyAnb2JqZWN0SWQnIDogZmllbGQ7XG4gICAgICAgIGNvbnN0IHR5cGUgPSB0cmFuc2Zvcm1Db25zdHJhaW50VHlwZVRvR3JhcGhRTChcbiAgICAgICAgICBwYXJzZUNsYXNzLmZpZWxkc1twYXJzZUZpZWxkXS50eXBlLFxuICAgICAgICAgIHBhcnNlQ2xhc3MuZmllbGRzW3BhcnNlRmllbGRdLnRhcmdldENsYXNzLFxuICAgICAgICAgIHBhcnNlR3JhcGhRTFNjaGVtYS5wYXJzZUNsYXNzVHlwZXNcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uZmllbGRzLFxuICAgICAgICAgICAgW2ZpZWxkXToge1xuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYFRoaXMgaXMgdGhlIG9iamVjdCAke2ZpZWxkfS5gLFxuICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICAgIH1cbiAgICAgIH0sIHt9KSxcbiAgICAgIF9vcjoge1xuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlICRvciBvcGVyYXRvciB0byBjb21wb3VuZCBjb25zdHJhaW50cy4nLFxuICAgICAgICB0eXBlOiBuZXcgR3JhcGhRTExpc3QobmV3IEdyYXBoUUxOb25OdWxsKGNsYXNzR3JhcGhRTENvbnN0cmFpbnRzVHlwZSkpLFxuICAgICAgfSxcbiAgICAgIF9hbmQ6IHtcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIHRoZSAkYW5kIG9wZXJhdG9yIHRvIGNvbXBvdW5kIGNvbnN0cmFpbnRzLicsXG4gICAgICAgIHR5cGU6IG5ldyBHcmFwaFFMTGlzdChuZXcgR3JhcGhRTE5vbk51bGwoY2xhc3NHcmFwaFFMQ29uc3RyYWludHNUeXBlKSksXG4gICAgICB9LFxuICAgICAgX25vcjoge1xuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlICRub3Igb3BlcmF0b3IgdG8gY29tcG91bmQgY29uc3RyYWludHMuJyxcbiAgICAgICAgdHlwZTogbmV3IEdyYXBoUUxMaXN0KG5ldyBHcmFwaFFMTm9uTnVsbChjbGFzc0dyYXBoUUxDb25zdHJhaW50c1R5cGUpKSxcbiAgICAgIH0sXG4gICAgfSksXG4gIH0pO1xuICBjbGFzc0dyYXBoUUxDb25zdHJhaW50c1R5cGUgPVxuICAgIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShjbGFzc0dyYXBoUUxDb25zdHJhaW50c1R5cGUpIHx8XG4gICAgZGVmYXVsdEdyYXBoUUxUeXBlcy5PQkpFQ1Q7XG5cbiAgY29uc3QgY2xhc3NHcmFwaFFMT3JkZXJUeXBlTmFtZSA9IGAke2dyYXBoUUxDbGFzc05hbWV9T3JkZXJgO1xuICBsZXQgY2xhc3NHcmFwaFFMT3JkZXJUeXBlID0gbmV3IEdyYXBoUUxFbnVtVHlwZSh7XG4gICAgbmFtZTogY2xhc3NHcmFwaFFMT3JkZXJUeXBlTmFtZSxcbiAgICBkZXNjcmlwdGlvbjogYFRoZSAke2NsYXNzR3JhcGhRTE9yZGVyVHlwZU5hbWV9IGlucHV0IHR5cGUgaXMgdXNlZCB3aGVuIHNvcnRpbmcgb2JqZWN0cyBvZiB0aGUgJHtncmFwaFFMQ2xhc3NOYW1lfSBjbGFzcy5gLFxuICAgIHZhbHVlczogY2xhc3NTb3J0RmllbGRzLnJlZHVjZSgoc29ydEZpZWxkcywgZmllbGRDb25maWcpID0+IHtcbiAgICAgIGNvbnN0IHsgZmllbGQsIGFzYywgZGVzYyB9ID0gZmllbGRDb25maWc7XG4gICAgICBjb25zdCB1cGRhdGVkU29ydEZpZWxkcyA9IHtcbiAgICAgICAgLi4uc29ydEZpZWxkcyxcbiAgICAgIH07XG4gICAgICBpZiAoYXNjKSB7XG4gICAgICAgIHVwZGF0ZWRTb3J0RmllbGRzW2Ake2ZpZWxkfV9BU0NgXSA9IHsgdmFsdWU6IGZpZWxkIH07XG4gICAgICB9XG4gICAgICBpZiAoZGVzYykge1xuICAgICAgICB1cGRhdGVkU29ydEZpZWxkc1tgJHtmaWVsZH1fREVTQ2BdID0geyB2YWx1ZTogYC0ke2ZpZWxkfWAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1cGRhdGVkU29ydEZpZWxkcztcbiAgICB9LCB7fSksXG4gIH0pO1xuICBjbGFzc0dyYXBoUUxPcmRlclR5cGUgPSBwYXJzZUdyYXBoUUxTY2hlbWEuYWRkR3JhcGhRTFR5cGUoXG4gICAgY2xhc3NHcmFwaFFMT3JkZXJUeXBlXG4gICk7XG5cbiAgY29uc3QgY2xhc3NHcmFwaFFMRmluZEFyZ3MgPSB7XG4gICAgd2hlcmU6IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnVGhlc2UgYXJlIHRoZSBjb25kaXRpb25zIHRoYXQgdGhlIG9iamVjdHMgbmVlZCB0byBtYXRjaCBpbiBvcmRlciB0byBiZSBmb3VuZC4nLFxuICAgICAgdHlwZTogY2xhc3NHcmFwaFFMQ29uc3RyYWludHNUeXBlLFxuICAgIH0sXG4gICAgb3JkZXI6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZpZWxkcyB0byBiZSB1c2VkIHdoZW4gc29ydGluZyB0aGUgZGF0YSBmZXRjaGVkLicsXG4gICAgICB0eXBlOiBjbGFzc0dyYXBoUUxPcmRlclR5cGVcbiAgICAgICAgPyBuZXcgR3JhcGhRTExpc3QobmV3IEdyYXBoUUxOb25OdWxsKGNsYXNzR3JhcGhRTE9yZGVyVHlwZSkpXG4gICAgICAgIDogR3JhcGhRTFN0cmluZyxcbiAgICB9LFxuICAgIHNraXA6IGRlZmF1bHRHcmFwaFFMVHlwZXMuU0tJUF9BVFQsXG4gICAgbGltaXQ6IGRlZmF1bHRHcmFwaFFMVHlwZXMuTElNSVRfQVRULFxuICAgIHJlYWRQcmVmZXJlbmNlOiBkZWZhdWx0R3JhcGhRTFR5cGVzLlJFQURfUFJFRkVSRU5DRV9BVFQsXG4gICAgaW5jbHVkZVJlYWRQcmVmZXJlbmNlOiBkZWZhdWx0R3JhcGhRTFR5cGVzLklOQ0xVREVfUkVBRF9QUkVGRVJFTkNFX0FUVCxcbiAgICBzdWJxdWVyeVJlYWRQcmVmZXJlbmNlOiBkZWZhdWx0R3JhcGhRTFR5cGVzLlNVQlFVRVJZX1JFQURfUFJFRkVSRU5DRV9BVFQsXG4gIH07XG5cbiAgY29uc3QgY2xhc3NHcmFwaFFMT3V0cHV0VHlwZU5hbWUgPSBgJHtncmFwaFFMQ2xhc3NOYW1lfWA7XG4gIGNvbnN0IG91dHB1dEZpZWxkcyA9ICgpID0+IHtcbiAgICByZXR1cm4gY2xhc3NPdXRwdXRGaWVsZHMucmVkdWNlKChmaWVsZHMsIGZpZWxkKSA9PiB7XG4gICAgICBjb25zdCB0eXBlID0gdHJhbnNmb3JtT3V0cHV0VHlwZVRvR3JhcGhRTChcbiAgICAgICAgcGFyc2VDbGFzcy5maWVsZHNbZmllbGRdLnR5cGUsXG4gICAgICAgIHBhcnNlQ2xhc3MuZmllbGRzW2ZpZWxkXS50YXJnZXRDbGFzcyxcbiAgICAgICAgcGFyc2VHcmFwaFFMU2NoZW1hLnBhcnNlQ2xhc3NUeXBlc1xuICAgICAgKTtcbiAgICAgIGlmIChwYXJzZUNsYXNzLmZpZWxkc1tmaWVsZF0udHlwZSA9PT0gJ1JlbGF0aW9uJykge1xuICAgICAgICBjb25zdCB0YXJnZXRQYXJzZUNsYXNzVHlwZXMgPVxuICAgICAgICAgIHBhcnNlR3JhcGhRTFNjaGVtYS5wYXJzZUNsYXNzVHlwZXNbXG4gICAgICAgICAgICBwYXJzZUNsYXNzLmZpZWxkc1tmaWVsZF0udGFyZ2V0Q2xhc3NcbiAgICAgICAgICBdO1xuICAgICAgICBjb25zdCBhcmdzID0gdGFyZ2V0UGFyc2VDbGFzc1R5cGVzXG4gICAgICAgICAgPyB0YXJnZXRQYXJzZUNsYXNzVHlwZXMuY2xhc3NHcmFwaFFMRmluZEFyZ3NcbiAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5maWVsZHMsXG4gICAgICAgICAgW2ZpZWxkXToge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBUaGlzIGlzIHRoZSBvYmplY3QgJHtmaWVsZH0uYCxcbiAgICAgICAgICAgIGFyZ3MsXG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgYXN5bmMgcmVzb2x2ZShzb3VyY2UsIGFyZ3MsIGNvbnRleHQsIHF1ZXJ5SW5mbykge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAgICAgIHdoZXJlLFxuICAgICAgICAgICAgICAgICAgb3JkZXIsXG4gICAgICAgICAgICAgICAgICBza2lwLFxuICAgICAgICAgICAgICAgICAgbGltaXQsXG4gICAgICAgICAgICAgICAgICByZWFkUHJlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgIGluY2x1ZGVSZWFkUHJlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgIHN1YnF1ZXJ5UmVhZFByZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgfSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjb25maWcsIGF1dGgsIGluZm8gfSA9IGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRGaWVsZHMgPSBnZXRGaWVsZE5hbWVzKHF1ZXJ5SW5mbyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IGtleXMsIGluY2x1ZGUgfSA9IGV4dHJhY3RLZXlzQW5kSW5jbHVkZShcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmllbGRzXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZmllbGQgPT4gZmllbGQuaW5jbHVkZXMoJy4nKSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChmaWVsZCA9PiBmaWVsZC5zbGljZShmaWVsZC5pbmRleE9mKCcuJykgKyAxKSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBvYmplY3RzUXVlcmllcy5maW5kT2JqZWN0cyhcbiAgICAgICAgICAgICAgICAgIHNvdXJjZVtmaWVsZF0uY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBfcmVsYXRlZFRvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfX3R5cGU6ICdQb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0SWQ6IHNvdXJjZS5vYmplY3RJZCxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIGtleTogZmllbGQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC4uLih3aGVyZSB8fCB7fSksXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgb3JkZXIsXG4gICAgICAgICAgICAgICAgICBza2lwLFxuICAgICAgICAgICAgICAgICAgbGltaXQsXG4gICAgICAgICAgICAgICAgICBrZXlzLFxuICAgICAgICAgICAgICAgICAgaW5jbHVkZSxcbiAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgcmVhZFByZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICBpbmNsdWRlUmVhZFByZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICBzdWJxdWVyeVJlYWRQcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgICAgYXV0aCxcbiAgICAgICAgICAgICAgICAgIGluZm8sXG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5tYXAoZmllbGQgPT4gZmllbGQuc3BsaXQoJy4nLCAxKVswXSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VHcmFwaFFMU2NoZW1hLmhhbmRsZUVycm9yKGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHBhcnNlQ2xhc3MuZmllbGRzW2ZpZWxkXS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5maWVsZHMsXG4gICAgICAgICAgW2ZpZWxkXToge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBUaGlzIGlzIHRoZSBvYmplY3QgJHtmaWVsZH0uYCxcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICBhc3luYyByZXNvbHZlKHNvdXJjZSkge1xuICAgICAgICAgICAgICBpZiAoc291cmNlW2ZpZWxkXSAmJiBzb3VyY2VbZmllbGRdLmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZVtmaWVsZF0uY29vcmRpbmF0ZXMubWFwKGNvb3JkaW5hdGUgPT4gKHtcbiAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiBjb29yZGluYXRlWzBdLFxuICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBjb29yZGluYXRlWzFdLFxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChwYXJzZUNsYXNzLmZpZWxkc1tmaWVsZF0udHlwZSA9PT0gJ0FycmF5Jykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmZpZWxkcyxcbiAgICAgICAgICBbZmllbGRdOiB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogYFVzZSBJbmxpbmUgRnJhZ21lbnQgb24gQXJyYXkgdG8gZ2V0IHJlc3VsdHM6IGh0dHBzOi8vZ3JhcGhxbC5vcmcvbGVhcm4vcXVlcmllcy8jaW5saW5lLWZyYWdtZW50c2AsXG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgYXN5bmMgcmVzb2x2ZShzb3VyY2UpIHtcbiAgICAgICAgICAgICAgaWYgKCFzb3VyY2VbZmllbGRdKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZVtmaWVsZF0ubWFwKGFzeW5jIGVsZW0gPT4ge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NOYW1lICYmXG4gICAgICAgICAgICAgICAgICBlbGVtLm9iamVjdElkICYmXG4gICAgICAgICAgICAgICAgICBlbGVtLl9fdHlwZSA9PT0gJ09iamVjdCdcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogZWxlbSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5maWVsZHMsXG4gICAgICAgICAgW2ZpZWxkXToge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBUaGlzIGlzIHRoZSBvYmplY3QgJHtmaWVsZH0uYCxcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICB9XG4gICAgfSwgZGVmYXVsdEdyYXBoUUxUeXBlcy5QQVJTRV9PQkpFQ1RfRklFTERTKTtcbiAgfTtcbiAgbGV0IGNsYXNzR3JhcGhRTE91dHB1dFR5cGUgPSBuZXcgR3JhcGhRTE9iamVjdFR5cGUoe1xuICAgIG5hbWU6IGNsYXNzR3JhcGhRTE91dHB1dFR5cGVOYW1lLFxuICAgIGRlc2NyaXB0aW9uOiBgVGhlICR7Y2xhc3NHcmFwaFFMT3V0cHV0VHlwZU5hbWV9IG9iamVjdCB0eXBlIGlzIHVzZWQgaW4gb3BlcmF0aW9ucyB0aGF0IGludm9sdmUgb3V0cHV0dGluZyBvYmplY3RzIG9mICR7Z3JhcGhRTENsYXNzTmFtZX0gY2xhc3MuYCxcbiAgICBpbnRlcmZhY2VzOiBbZGVmYXVsdEdyYXBoUUxUeXBlcy5QQVJTRV9PQkpFQ1RdLFxuICAgIGZpZWxkczogb3V0cHV0RmllbGRzLFxuICB9KTtcbiAgY2xhc3NHcmFwaFFMT3V0cHV0VHlwZSA9IHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZShcbiAgICBjbGFzc0dyYXBoUUxPdXRwdXRUeXBlXG4gICk7XG5cbiAgY29uc3QgY2xhc3NHcmFwaFFMRmluZFJlc3VsdFR5cGVOYW1lID0gYCR7Z3JhcGhRTENsYXNzTmFtZX1GaW5kUmVzdWx0YDtcbiAgbGV0IGNsYXNzR3JhcGhRTEZpbmRSZXN1bHRUeXBlID0gbmV3IEdyYXBoUUxPYmplY3RUeXBlKHtcbiAgICBuYW1lOiBjbGFzc0dyYXBoUUxGaW5kUmVzdWx0VHlwZU5hbWUsXG4gICAgZGVzY3JpcHRpb246IGBUaGUgJHtjbGFzc0dyYXBoUUxGaW5kUmVzdWx0VHlwZU5hbWV9IG9iamVjdCB0eXBlIGlzIHVzZWQgaW4gdGhlICR7Z3JhcGhRTENsYXNzTmFtZX0gZmluZCBxdWVyeSB0byByZXR1cm4gdGhlIGRhdGEgb2YgdGhlIG1hdGNoZWQgb2JqZWN0cy5gLFxuICAgIGZpZWxkczoge1xuICAgICAgcmVzdWx0czoge1xuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgdGhlIG9iamVjdHMgcmV0dXJuZWQgYnkgdGhlIHF1ZXJ5JyxcbiAgICAgICAgdHlwZTogbmV3IEdyYXBoUUxOb25OdWxsKFxuICAgICAgICAgIG5ldyBHcmFwaFFMTGlzdChcbiAgICAgICAgICAgIG5ldyBHcmFwaFFMTm9uTnVsbChcbiAgICAgICAgICAgICAgY2xhc3NHcmFwaFFMT3V0cHV0VHlwZSB8fCBkZWZhdWx0R3JhcGhRTFR5cGVzLk9CSkVDVFxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgIH0sXG4gICAgICBjb3VudDogZGVmYXVsdEdyYXBoUUxUeXBlcy5DT1VOVF9BVFQsXG4gICAgfSxcbiAgfSk7XG4gIGNsYXNzR3JhcGhRTEZpbmRSZXN1bHRUeXBlID0gcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKFxuICAgIGNsYXNzR3JhcGhRTEZpbmRSZXN1bHRUeXBlXG4gICk7XG5cbiAgcGFyc2VHcmFwaFFMU2NoZW1hLnBhcnNlQ2xhc3NUeXBlc1tjbGFzc05hbWVdID0ge1xuICAgIGNsYXNzR3JhcGhRTFBvaW50ZXJUeXBlLFxuICAgIGNsYXNzR3JhcGhRTFJlbGF0aW9uVHlwZSxcbiAgICBjbGFzc0dyYXBoUUxTY2FsYXJUeXBlLFxuICAgIGNsYXNzR3JhcGhRTENyZWF0ZVR5cGUsXG4gICAgY2xhc3NHcmFwaFFMVXBkYXRlVHlwZSxcbiAgICBjbGFzc0dyYXBoUUxDb25zdHJhaW50VHlwZSxcbiAgICBjbGFzc0dyYXBoUUxDb25zdHJhaW50c1R5cGUsXG4gICAgY2xhc3NHcmFwaFFMRmluZEFyZ3MsXG4gICAgY2xhc3NHcmFwaFFMT3V0cHV0VHlwZSxcbiAgICBjbGFzc0dyYXBoUUxGaW5kUmVzdWx0VHlwZSxcbiAgICBjb25maWc6IHtcbiAgICAgIHBhcnNlQ2xhc3NDb25maWcsXG4gICAgICBpc0NyZWF0ZUVuYWJsZWQsXG4gICAgICBpc1VwZGF0ZUVuYWJsZWQsXG4gICAgfSxcbiAgfTtcblxuICBpZiAoY2xhc3NOYW1lID09PSAnX1VzZXInKSB7XG4gICAgY29uc3Qgdmlld2VyVHlwZSA9IG5ldyBHcmFwaFFMT2JqZWN0VHlwZSh7XG4gICAgICBuYW1lOiAnVmlld2VyJyxcbiAgICAgIGRlc2NyaXB0aW9uOiBgVGhlIFZpZXdlciBvYmplY3QgdHlwZSBpcyB1c2VkIGluIG9wZXJhdGlvbnMgdGhhdCBpbnZvbHZlIG91dHB1dHRpbmcgdGhlIGN1cnJlbnQgdXNlciBkYXRhLmAsXG4gICAgICBpbnRlcmZhY2VzOiBbZGVmYXVsdEdyYXBoUUxUeXBlcy5QQVJTRV9PQkpFQ1RdLFxuICAgICAgZmllbGRzOiAoKSA9PiAoe1xuICAgICAgICAuLi5vdXRwdXRGaWVsZHMoKSxcbiAgICAgICAgc2Vzc2lvblRva2VuOiBkZWZhdWx0R3JhcGhRTFR5cGVzLlNFU1NJT05fVE9LRU5fQVRULFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgcGFyc2VHcmFwaFFMU2NoZW1hLnZpZXdlclR5cGUgPSB2aWV3ZXJUeXBlO1xuICAgIHBhcnNlR3JhcGhRTFNjaGVtYS5hZGRHcmFwaFFMVHlwZSh2aWV3ZXJUeXBlLCB0cnVlLCB0cnVlKTtcblxuICAgIGNvbnN0IHVzZXJTaWduVXBJbnB1dFR5cGVOYW1lID0gJ1NpZ25VcEZpZWxkc0lucHV0JztcbiAgICBjb25zdCB1c2VyU2lnblVwSW5wdXRUeXBlID0gbmV3IEdyYXBoUUxJbnB1dE9iamVjdFR5cGUoe1xuICAgICAgbmFtZTogdXNlclNpZ25VcElucHV0VHlwZU5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogYFRoZSAke3VzZXJTaWduVXBJbnB1dFR5cGVOYW1lfSBpbnB1dCB0eXBlIGlzIHVzZWQgaW4gb3BlcmF0aW9ucyB0aGF0IGludm9sdmUgaW5wdXR0aW5nIG9iamVjdHMgb2YgJHtncmFwaFFMQ2xhc3NOYW1lfSBjbGFzcyB3aGVuIHNpZ25pbmcgdXAuYCxcbiAgICAgIGZpZWxkczogKCkgPT5cbiAgICAgICAgY2xhc3NDcmVhdGVGaWVsZHMucmVkdWNlKChmaWVsZHMsIGZpZWxkKSA9PiB7XG4gICAgICAgICAgY29uc3QgdHlwZSA9IHRyYW5zZm9ybUlucHV0VHlwZVRvR3JhcGhRTChcbiAgICAgICAgICAgIHBhcnNlQ2xhc3MuZmllbGRzW2ZpZWxkXS50eXBlLFxuICAgICAgICAgICAgcGFyc2VDbGFzcy5maWVsZHNbZmllbGRdLnRhcmdldENsYXNzLFxuICAgICAgICAgICAgcGFyc2VHcmFwaFFMU2NoZW1hLnBhcnNlQ2xhc3NUeXBlc1xuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLmZpZWxkcyxcbiAgICAgICAgICAgICAgW2ZpZWxkXToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgVGhpcyBpcyB0aGUgb2JqZWN0ICR7ZmllbGR9LmAsXG4gICAgICAgICAgICAgICAgdHlwZTpcbiAgICAgICAgICAgICAgICAgIGZpZWxkID09PSAndXNlcm5hbWUnIHx8IGZpZWxkID09PSAncGFzc3dvcmQnXG4gICAgICAgICAgICAgICAgICAgID8gbmV3IEdyYXBoUUxOb25OdWxsKHR5cGUpXG4gICAgICAgICAgICAgICAgICAgIDogdHlwZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7fSksXG4gICAgfSk7XG4gICAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKHVzZXJTaWduVXBJbnB1dFR5cGUsIHRydWUsIHRydWUpO1xuXG4gICAgY29uc3QgdXNlckxvZ0luSW5wdXRUeXBlTmFtZSA9ICdMb2dJbkZpZWxkc0lucHV0JztcbiAgICBjb25zdCB1c2VyTG9nSW5JbnB1dFR5cGUgPSBuZXcgR3JhcGhRTElucHV0T2JqZWN0VHlwZSh7XG4gICAgICBuYW1lOiB1c2VyTG9nSW5JbnB1dFR5cGVOYW1lLFxuICAgICAgZGVzY3JpcHRpb246IGBUaGUgJHt1c2VyTG9nSW5JbnB1dFR5cGVOYW1lfSBpbnB1dCB0eXBlIGlzIHVzZWQgdG8gbG9naW4uYCxcbiAgICAgIGZpZWxkczoge1xuICAgICAgICB1c2VybmFtZToge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgdXNlcm5hbWUgdXNlZCB0byBsb2cgdGhlIHVzZXIgaW4uJyxcbiAgICAgICAgICB0eXBlOiBuZXcgR3JhcGhRTE5vbk51bGwoR3JhcGhRTFN0cmluZyksXG4gICAgICAgIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIHRoZSBwYXNzd29yZCB1c2VkIHRvIGxvZyB0aGUgdXNlciBpbi4nLFxuICAgICAgICAgIHR5cGU6IG5ldyBHcmFwaFFMTm9uTnVsbChHcmFwaFFMU3RyaW5nKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcGFyc2VHcmFwaFFMU2NoZW1hLmFkZEdyYXBoUUxUeXBlKHVzZXJMb2dJbklucHV0VHlwZSwgdHJ1ZSwgdHJ1ZSk7XG5cbiAgICBwYXJzZUdyYXBoUUxTY2hlbWEucGFyc2VDbGFzc1R5cGVzW1xuICAgICAgY2xhc3NOYW1lXG4gICAgXS5zaWduVXBJbnB1dFR5cGUgPSB1c2VyU2lnblVwSW5wdXRUeXBlO1xuICAgIHBhcnNlR3JhcGhRTFNjaGVtYS5wYXJzZUNsYXNzVHlwZXNbXG4gICAgICBjbGFzc05hbWVcbiAgICBdLmxvZ0luSW5wdXRUeXBlID0gdXNlckxvZ0luSW5wdXRUeXBlO1xuICB9XG59O1xuXG5leHBvcnQgeyBleHRyYWN0S2V5c0FuZEluY2x1ZGUsIGxvYWQgfTtcbiJdfQ==