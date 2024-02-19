import { Router } from 'express';
import * as object from '../models/object_index.js';
import { hashPassword } from '../utils/crypting.js';
import { generateRandomPassword, generateRegistrationLink } from '../utils/userUtils.js';
import { ConsoleResponses, HTTPResponses } from '../utils/serverResponses.js';

/**
 * This file defines a set of routes under the '/user' path.
 * It's responsible for handling user-related operations such as retrieving user information,
 * deleting user information, managing user groups
 */

export const getUserRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, _next) => {
    try {
      const userId = req.header('user_id');
      if (!userId) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const user = await object.end_user.findOne({
        where: {
          id: req.header(userId),
        },
      });

      if (!user) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      res.status(200).send(user);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.delete('/', async (req, res, _next) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const user = await object.end_user.findOne({ where: { id: userId } });
      if (user === null) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      await user.destroy();
      res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.DELETE_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.get('/getAllUsers', async (req, res, _next) => {
    try {
      const id = req.header('user_id');
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const user = object.end_user.findOne({ where: { id: id } });

      if (!user) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      if (!user.is_admin) {
        return res.status(403).json(HTTPResponses.Error[403]);
      }

      const users = object.end_user.findAll();
      res.status(200).send(users);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.put('/clearUserInfo', async (req, res, _next) => {
    try {
      const id = req.header('user_id');
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
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
        res.status(404).json(HTTPResponses.Error[404]);
      } else {
        res.status(200).json(HTTPResponses.Success[200]);
      }
    } catch (error) {
      console.error(ConsoleResponses.PUT_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.put('/assingAdminPrivilege', async (req, res, _next) => {    
    try {
      const id = req.header('user_id');
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const user = await object.end_user.findOne({ where: { id: id } });
      if (user === null) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      await user.update({ is_admin: true });
      res.status(200).json(HTTPResponses.Error[200]);
    } catch (error) {
      console.error(ConsoleResponses.PUT_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.put('/revokeAdminPrivilege', async (req, res, _next) => {    
    try {
      const id = req.header('user_id');
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const user = await object.end_user.findOne({ where: { id: id } });
      if (user === null) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      await user.update({ is_admin: false });
      res.status(200).json(HTTPResponses.Error[200]);
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error);
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
        return res.status(500).json(HTTPResponses.Error[500]);
      }

      const id = result.id;
      const link = generateRegistrationLink(id);

      const group = await result.update({ registration_link: link });

      if (group === null) {
        res.status(500).json(HTTPResponses.Error[500]);
      }
      res.status(201).send(group);
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.post('/deactivateUserGroup', async (req, res, _next) => {
    try {
      const id = req.header('id');
      if(!id) {
        return res.status(403).json(HTTPResponses.Error[400]);
      }
      const user = await object.end_user.findOne({ where: { id: id } });
      if (!user.is_admin) {
        return res.status(403).json(HTTPResponses.Error[403]);
      }
      const userGroupId = req.header('user_group_id');
      const userGroup = await object.user_group.findOne({ where: { id: userGroupId } });

      if (userGroup === null) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      const result = await userGroup.update({ is_active: false });

      if (result !== null) {
        return res.status(200).json(HTTPResponses.Success[200]);
      }
      res.status(500).json(HTTPResponses.Error[500]);
    } catch (error) {
      console.error(Console.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.get('/getUserGroups', async (req, res, _next) => {
    const id = req.header('id');
    try {
      const user = await object.end_user.findOne({ where: { id: id } });
      if (!user.is_admin) {
        return res.status(403).json(HTTPResponses.Error[403]);
      }

      const userGroups = await object.user_group.findAll();
      if (!userGroups) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      res.status(200).send(userGroups);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.post('/logout', async (req, res, _next) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const user = await object.end_user.findOne({ where: { id: id } });

      if (!user) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      user.refresh_token = null;
      await user.save();

      return res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.patch('/update-password-admin', async (req, res, _next) => {    
    try {
      const id = req.header('id');
      const userToEditId = req.header('userToEditId');
      const user = await object.end_user.findOne({ where: { id: id } });
      if (!user.is_admin && id != userToEditId) {
        return res.status(403).json(HTTPResponses.Error[403]);
      } else {
        const { newPassword } = req.body;
        const userToUpdate = await object.end_user.findOne({ where: { id: userToEditId } });

        if (userToUpdate) {
          const hash = await hashPassword(newPassword);
          const result = await userToUpdate.update({ password: hash });
          res.status(201).send(result);
        } else {
          res.status(404).json(HTTPResponses.Error[404]);
        }
      }
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.patch('/update-password', async (req, res, _next) => {    
    try {
      const id = req.header('id');
      const { newPassword } = req.body;
      const userToUpdate = await object.end_user.findOne({ where: { id: id } });

      if (userToUpdate) {
        const hash = await hashPassword(newPassword);
        const result = await userToUpdate.update({ password: hash });
        res.status(201).send(result);
      } else {
        res.status(404).json(HTTPResponses.Error[404]);
      }
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.patch('/updateUsername', async (req, res, _next) => {    
    try {
      const id = req.header('id');
      const { newUsername } = req.body;
      const sameUsername = await object.end_user.findOne({ where: { email: newUsername } });
      if (sameUsername !== null) {
        res.status(400).json(HTTPResponses.Error[400]);
      } else {
        const userToUpdate = await object.end_user.findOne({ where: { id: id } });

        if (userToUpdate) {
          const result = await userToUpdate.update({ email: newUsername });
          res.status(201).send(result);
        } else {
          res.status(404).json(HTTPResponses.Error[404]);
        }
      }
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  return router;
};
