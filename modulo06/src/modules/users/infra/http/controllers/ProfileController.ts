import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        const showProfile = container.resolve(ShowProfileService);

        const user = await showProfile.execute({ user_id });

        delete user.password;

        return response.json(user);
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { name, email, password, old_password } = request.body;

        const updateProfile = container.resolve(UpdateProfileService);

        const updatedUser = await updateProfile.execute({
            user_id,
            name,
            email,
            password,
            old_password,
        });

        delete updatedUser.password;

        return response.json(updatedUser);
    }
}

export default ProfileController;
