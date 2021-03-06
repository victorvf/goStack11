import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

class UsersAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id: user_id } = request.user;
        const { filename: avatarFilename } = request.file;

        const updateUserAvatar = container.resolve(UpdateUserAvatarService);

        const user = await updateUserAvatar.execute({
            user_id,
            avatarFilename,
        });

        delete user.password;

        return response.json(user);
    }
}

export default UsersAvatarController;
