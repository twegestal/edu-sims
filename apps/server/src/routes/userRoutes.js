import { Router } from 'express';
import * as object from '../models/object_index.js';
import { hashPassword } from '../utils/crypting.js';
import { generateRandomPassword, generateRegistrationLink } from '../utils/userUtils.js';

export const getUserRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    const user = await object.end_user.findOne({
      where: {
        id: req.header('user_id'),
      },
    });

    if (user === null) {
      res.status(404).json('User not found'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
    } else {
      res.status(200).json(user);
    }
  });

  router.delete('', async (req, res, next) => {
    /*
        Query the database to see if the user exists:
        */
    const user = await object.end_user.findOne({
      where: {
        id: req.body.user_id,
      },
    });

    if (user === null) {
      res.status(400).json('User not found'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
    } else {
      await end_user.destroy({
        where: {
          id: user.id,
        },
      });

      res.status(200).json('User removed');
    }
  });

  router.delete('/delete-all-users', async (req, res, next) => {
    //await object.end_user.truncate();
    //metoden ovan funkar inte när det finns foreign key constraints, jag blev lite skraj och har inte fortsatt :)
    res.status(200).json('All users removed');
  });

  router.get('/getAllUsers', async (req, res, _next) => {
    const request_user = await object.end_user.findOne({
      where: {
        id: req.header('user_id'),
      },
    });
    //Checks if the user_id the request comes with belongs to an admin
    if (request_user.is_admin == true) {
      const user = await object.end_user.findAll();

      if (user === null) {
        res.status(404).json('No users found');
      } else {
        res.status(200).json(user);
      }
    } else {
      res.status(404).json('Only admins can perform this request');
    }
  });

  router.put('/clearUserInfo', async (req, res, _next) => {
    try {
      const id = req.header('user_id');
      if (!id) {
        return res.status(400).json('Could not find resource');
      }
      const generatedPassword = generateRandomPassword();
      const hashedPassword = await hashPassword(generatedPassword);
      const result = await object.end_user.update(
        {
          email: 'DeletedUser',
          password: hashedPassword,
        },
        {
          where: {
            id: id,
          },
        },
      );

      if (!result) {
        res.status(404).json('No users found');
      } else {
        res.status(200).json('User deleted');
      }
    } catch (error) {
      console.error('error clearing user info ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.put('/assingAdminPrivilege', async (req, res, next) => {
    const result = await object.end_user.update(
      {
        is_admin: true,
      },
      {
        where: {
          id: req.header('user_id'),
        },
      },
    );

    if (result === null) {
      res.status(404).json('No user found');
    } else {
      res.status(200).json('User set as admin');
    }
  });

  router.put('/revokeAdminPrivilege', async (req, res, next) => {
    const result = await object.end_user.update(
      {
        is_admin: false,
      },
      {
        where: {
          id: req.header('user_id'),
        },
      },
    );

    if (result === null) {
      res.status(404).json('No user found');
    } else {
      res.status(200).json('User set as not admin');
    }
  });

  router.post('/createUserGroup', async (req, res, _next) => {
    const { groupName } = req.body;

    try {
      const exists = await object.user_group.findOne({ where: { name: groupName } });
      if (exists !== null) {
        return res.status(400).json(`Can't create group with the selected name: ${groupName}`);
      }

      const result = await object.user_group.create({
        name: groupName,
        is_active: true,
      });

      if (result === null) {
        return res.status(404).json('No group created');
      }

      const id = result.id;
      const link = generateRegistrationLink(id);

      const group = await result.update({ registration_link: link });

      if (group === null) {
        res.status(500).json('Internal Server Error');
      }
      res.status(201).send(group);
    } catch (error) {
      console.error('error creating group ', error);
      res.status(500).json('Internal Server Error');
    }
  });

  router.post('/deactivateUserGroup', async (req, res, _next) => {
    const id = req.header('id');
    try {
      const user = await object.end_user.findOne({ where: { id: id } });
      if (!user.is_admin) {
        return res.status(403).json('Not authorized for selected resource');
      }
      const userGroupId = req.header('user_group_id');
      const userGroup = await object.user_group.findOne({ where: { id: userGroupId } });

      if (userGroup === null) {
        return res.status(404).json('Resource not found');
      }

      const result = await userGroup.update({ is_active: false });

      if (result !== null) {
        return res.status(200).json('Resource deactivated');
      }
      res.status(400).json('Could not parse the request');
    } catch (error) {
      res.status(500).json('Internal Server Error');
    }
  });

  router.get('/getUserGroups', async (req, res, _next) => {
    const id = req.header('id');
    try {
      const user = await object.end_user.findOne({ where: { id: id } });
      if (!user.is_admin) {
        return res.status(403).json('Not authorized for selected resource');
      }

      const userGroups = await object.user_group.findAll();
      if (!userGroups) {
        return res.status(404).json('Resource not found');
      }
      res.status(200).send(userGroups);
    } catch (error) {
      res.status(500).json('Internal Server Error');
    }
  });

  router.post('/logout', async (req, res, _next) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json('Identifier missing');
    }

    try {
      const user = await object.end_user.findOne({ where: { id: id } });

      if (!user) {
        return res.status(404).json('Could not find resource');
      }

      user.refresh_token = null;
      await user.save();

      return res.status(200).json('Logout succesful');
    } catch (error) {
      console.error('Error logging out ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.patch('/update-password-admin', async (req, res, _next) => {
    const id = req.header('id');
    const userToEditId = req.header('userToEditId');

    try {
      const user = await object.end_user.findOne({ where: { id: id } });
      if (!user.is_admin && id != userToEditId) {
        return res.status(403).json('Not authorized for selected resource');
      } else {
        const { newPassword } = req.body;
        const userToUpdate = await object.end_user.findOne({ where: { id: userToEditId } });

        if (userToUpdate) {
          const hash = await hashPassword(newPassword);
          const result = await userToUpdate.update({ password: hash });
          res.status(201).send(result);
        } else {
          res.status(404).json('Could not find resource');
        }
      }
    } catch (error) {
      console.error('error in update-password: ', error);
      res.status(500).json('Internal Server Error');
    }
  });

  router.patch('/update-password', async (req, res, _next) => {
    const id = req.header('id');

    try {
      const { newPassword } = req.body;
      const userToUpdate = await object.end_user.findOne({ where: { id: id } });

      if (userToUpdate) {
        const hash = await hashPassword(newPassword);
        const result = await userToUpdate.update({ password: hash });
        res.status(201).send(result);
      } else {
        res.status(404).json('Could not find resource');
      }
    } catch (error) {
      console.error('error in update-password: ', error);
      res.status(500).json('Internal Server Error');
    }
  });

  router.patch('/updateUsername', async (req, res, _next) => {
    const id = req.header('id');
    const { newUsername } = req.body;
    const sameUsername = await object.end_user.findOne({ where: { email: newUsername } });

    if (sameUsername !== null) {
      res.status(400).json('Email is already registered');
    } else {
      const userToUpdate = await object.end_user.findOne({ where: { id: id } });

      if (userToUpdate) {
        const result = await userToUpdate.update({ email: newUsername });
        res.status(201).send(result);
      } else {
        res.status(404).json('Could not find resource');
      }
    }
  });

  return router;
};
