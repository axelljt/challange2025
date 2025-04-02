"use strict";
// Author: Axell Jose Tejada Calderon
// Date: 2025/03/31
// Purpose: Process an array of objects, add the execution date,
// and display active records sorted by a specific property.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var swagger_jsdoc_1 = require("swagger-jsdoc");
var swagger_ui_express_1 = require("swagger-ui-express");
// Sample dataset: Array of people
var peopleArray = [
    { Name: 'Rocky', FavoriteFood: 'Sushi', FavoriteMovie: 'Back to The Future', Status: 'Inactive' },
    { Name: 'Miroslav', FavoriteFood: 'Sushi', FavoriteMovie: 'American Psycho', Status: 'Active' },
    { Name: 'Donny', FavoriteFood: 'Singapore chow mei fun', FavoriteMovie: 'The Princess Bride', Status: 'Inactive' },
    { Name: 'Matt', FavoriteFood: 'Brisket Tacos', FavoriteMovie: 'The Princess Bride', Status: 'Inactive' },
    { Name: 'Messi', FavoriteFood: 'Milanesa a la Napolitana', FavoriteMovie: 'The Son of the Bride', Status: 'Active' }
];
// Function to add the execution date to each object in the array
var addExecutionDate = function (objects) {
    var currentDate = new Date().toISOString().split('T')[0];
    return objects.map(function (obj) { return (__assign(__assign({}, obj), { ExecutionDate: currentDate })); });
};
// Function to filter records based on the status
var filterRecordsByStatus = function (objects, status) {
    return objects.filter(function (obj) { return obj.Status === status; });
};
// Function to sort objects by the specified property
var sortObjectsByProperty = function (objects, property) {
    return __spreadArray([], objects, true).sort(function (a, b) {
        var valueA = a[property] || "";
        var valueB = b[property] || "";
        return valueA.toString().localeCompare(valueB.toString());
    });
};
// Swagger configuration for API documentation
var swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Active Records Management API',
            version: '1.0.0',
            description: 'Processes an array of objects, adds an execution date, and displays active records sorted by a specified property.',
            contact: {
                name: 'Axell Jose Tejada Calderon',
                url: 'http://example.com',
                email: 'axelljt@gmail.com'
            }
        },
        servers: [{ url: 'http://localhost:3000' }]
    },
    apis: ["server.ts"]
};
var swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
var app = (0, express_1.default)();
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use(express_1.default.json());
/**
 * @swagger
 * definitions:
 *  Person:
 *   type: object
 *   properties:
 *    Name:
 *     type: string
 *     description: The name of the person
 *     example: 'Rocky'
 *    FavoriteFood:
 *     type: string
 *     description: The favorite food of the person
 *     example: 'Sushi'
 *    FavoriteMovie:
 *     type: string
 *     description: The favorite movie of the person
 *     example: 'Back to The Future'
 *    Status:
 *     type: string
 *     description: The activity status of the person
 *     example: 'Inactive'
 *    ExecutionDate:
 *     type: string
 *     description: The execution date when the record was processed
 *     example: '2023-04-01'
 */
/**
 * @swagger
 * /active-records:
 *  get:
 *   summary: Retrieve active records sorted by a specified property
 *   description: Fetches active records from the dataset, adds an execution date, and sorts the data by a user-specified property.
 *   parameters:
 *    - in: query
 *      name: sortProperty
 *      required: true
 *      description: The property to sort the records by (e.g., Name, FavoriteMovie,FavoriteFood and ExecutionDate)
 *      schema:
 *       type: string
 *       example: Name
 *   responses:
 *    200:
 *     description: Successfully retrieved the active records sorted by the specified property
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          Name:
 *           type: string
 *           description: The name of the person
 *           example: Rocky
 *          ExecutionDate:
 *           type: string
 *           description: The date when the record was processed
 *           example: 2023-04-01
 *          FavoriteMovie:
 *           type: string
 *           description: The favorite movie of the person
 *           example: Back to The Future
 *    400:
 *     description: The sortProperty parameter is missing in the request
 *    404:
 *     description: No active records found
 */
app.get('/active-records', function (req, res) {
    var sortProperty = req.query.sortProperty;
    if (!sortProperty) {
        res.status(400).json({ message: 'Missing sortProperty parameter' });
        return;
    }
    var updatedPeopleArray = addExecutionDate(peopleArray);
    var activeRecords = filterRecordsByStatus(updatedPeopleArray, 'Active');
    var sortedActiveRecords = sortObjectsByProperty(activeRecords, sortProperty);
    var filteredRecords = sortedActiveRecords.map(function (record) { return ({
        Name: record.Name,
        ExecutionDate: record.ExecutionDate,
        FavoriteMovie: record.FavoriteMovie,
    }); });
    if (filteredRecords.length > 0) {
        res.json(filteredRecords);
    }
    else {
        res.status(404).json({ message: 'No active records were found.' });
    }
});
app.listen(3000, function () {
    console.log('Server running at http://localhost:3000');
});
