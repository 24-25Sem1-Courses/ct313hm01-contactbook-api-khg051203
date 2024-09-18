const express = require('express');
const contactsController = require('../controllers/contacts.controller');
const { methodNotAllowed }= require('../controllers/errors.controller')
const router = express.Router();
module.exports.setup = (app) => {
    app.use('/api/v1/contacts', router);

/**
 * @swagger
 * /api/v1/contacts:
 *   get:
 *     summary: Get contacts by filter
 *     description: Get contacts by filter
 *     parameters:
 *       - in: query
 *         name: favorite
 *         schema:
 *           type: boolean
 *         description: Filter by favorite status
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by contact name
 *     tags:
 *       - contacts
 *     responses:
 *       200:
 *         description: A list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   properties:
 *                     contacts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Contacts'
 */


    router.get('/', contactsController.getContactsByFilter);
    router.post('/', contactsController.createContact);
    router.delete('/', contactsController.deleteAllContacts);
    router.all('/', methodNotAllowed);

    router.get('/:id', contactsController.getContact);
    router.put('/:id', contactsController.updateContact);
    router.delete('/:id', contactsController.deleteContact);
    router.all('/:id', methodNotAllowed);
};