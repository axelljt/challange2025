// Author: Axell Jose Tejada Calderon
// Date: 2025/03/31
// Purpose: Process an array of objects, add the execution date,
// and display active records sorted by a specific property.

import express, { Request, Response } from 'express';
import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';


// Define the type for a person in the array
interface Person {
    Name: string;
    FavoriteFood: string;
    FavoriteMovie: string;
    Status: string;
    ExecutionDate?: string;
}

// Sample dataset: Array of people
const peopleArray: Person[] = [
    { Name: 'Rocky', FavoriteFood: 'Sushi', FavoriteMovie: 'Back to The Future', Status: 'Inactive' },
    { Name: 'Miroslav', FavoriteFood: 'Sushi', FavoriteMovie: 'American Psycho', Status: 'Active' },
    { Name: 'Donny', FavoriteFood: 'Singapore chow mei fun', FavoriteMovie: 'The Princess Bride', Status: 'Inactive' },
    { Name: 'Matt', FavoriteFood: 'Brisket Tacos', FavoriteMovie: 'The Princess Bride', Status: 'Inactive' },
    { Name: 'Messi', FavoriteFood: 'Milanesa a la Napolitana', FavoriteMovie: 'The Son of the Bride', Status: 'Active' }
];

// Function to add the execution date to each object in the array
const addExecutionDate = (objects: Person[]): Person[] => {
    const currentDate = new Date().toISOString().split('T')[0];
    return objects.map(obj => ({ ...obj, ExecutionDate: currentDate }));
};

// Function to filter records based on the status
const filterRecordsByStatus = (objects: Person[], status: string): Person[] => {
    return objects.filter(obj => obj.Status === status);
};

// Function to sort objects by the specified property
const sortObjectsByProperty = (objects: Person[], property: keyof Person): Person[] => {
    return [...objects].sort((a, b) => {
        const valueA = a[property] || "";
        const valueB = b[property] || "";
        return valueA.toString().localeCompare(valueB.toString());
    });
};

// Swagger configuration for API documentation
const swaggerOptions: Options = {
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

const swaggerDocs = swaggerJSDoc(swaggerOptions);
const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(express.json());

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
app.get('/active-records', (req: Request, res: Response) => {
    const sortProperty = req.query.sortProperty as keyof Person;

    if (!sortProperty) {
        res.status(400).json({ message: 'Missing sortProperty parameter' });
        return;
    }

    const updatedPeopleArray = addExecutionDate(peopleArray);
    const activeRecords = filterRecordsByStatus(updatedPeopleArray, 'Active');
    const sortedActiveRecords = sortObjectsByProperty(activeRecords, sortProperty);

    const filteredRecords = sortedActiveRecords.map(record => ({
        Name: record.Name,
        ExecutionDate: record.ExecutionDate,
        FavoriteMovie: record.FavoriteMovie,
    }));

    if (filteredRecords.length > 0) {
        res.json(filteredRecords);
    } else {
        res.status(404).json({ message: 'No active records were found.' }); 
    }
});



app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
