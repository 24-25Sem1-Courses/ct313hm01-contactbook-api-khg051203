const contactsService = require('../services/contacts.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');
const { unlink } = require('node:fs'); 

async function createContact(req, res, next) {
    if (!req.body?.name || typeof req.body.name !== 'string') {
        return next(new ApiError(400, 'Name should be a non-empty string'));
    }
    try {
        const contact = await contactsService.createContact({
            ...req.body,
            avatar: req.file ? `/public/uploads/${req.file.filename}` : null,
        });
        return res
            .status(201)
            .set({
                Location: `/public/uploads/${contact.id}`,
            })
            .json(
                JSend.success({
                    contact,
                })
            );
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, 'An error occurred while creating the contact')
        );
    }
}

async function getContactsByFilter(req, res, next) {
    let result = {
        contacts: [],
        metadata: {
            totalRecords: 0,
            firstPage: 1,
            lastPage:5,
        },
     };

    try {
        result = await contactsService.getManyContacts(req.query);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, 'An error occured while retrieving contacts')
        );
    }
    return res.json(
        JSend.success({
            contacts: result.contacts,
        metadata: result.metadata,
     })
    );
}

function getManyContacts(query) { 
    const { name, favorite } = query; 
    return contactRepository() 
        .where((builder) => { 
            if (name) { 
                builder.where('name', 'like', `%${name}%`); 
            } 
            if (favorite !== undefined && 
                favorite !== '0' && 
                favorite !== 'false') { 
                builder.where('favorite', 1); 
            } 
        }) 
        .select('*'); 
}

module.exports = { 
    createContact, 
    getManyContacts
};


async function getContact(req, res, next) {
    const { id } = req.params;
    
    try {
        const contact = await contactsService.getContacById(id);
        if (!contact) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.json(JSend.success({ contact}));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving contact with id=${id}'))
    }
}

async function updateContact(req, res, next) {
    if (Object.keys(req.body).length !== 0 && !req.file) {
        return next(new ApiError(400, 'Data to updata can not be empty'));

    }

    const { id } = req.params;

    try {
        const updated = await contactsService.updateContact(id, {
            ...req.body,
            avatar: req.file ? '/public/uploads/${req.file.filename}' : null,
        });
        if (!updated) {
            return next(new ApiError(404, 'Contact not found'));

        }
        return res.json(
            JSend.success({
                contact: updated,
            })
        );
    } catch ( error) {
        console.log(error);
        return next(new ApiError(500, 'Error updating contact with id=${id}'))
    }
}

function deleteContact(req, res) {
    return res.json(JSend.success());
}

function deleteAllContacts(req, res) {
    return res.json(JSend.success());
}


module.exports = {
    getContactsByFilter,
    deleteAllContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    updateContact
};
