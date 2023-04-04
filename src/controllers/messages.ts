import { messagesAPI } from 'api/messages';
import { NotFound, UnauthorizedRoute } from 'errors';
import { Request, Response } from 'express';
import { isEmpty } from 'utils/others';

interface User {
  _id: string;
  email: string;
}

export const getMessages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const loggedUser = req.user as User;
  const { userEmail } = req.params;
  if (loggedUser && loggedUser.email === userEmail) {
    const messages = await messagesAPI.get(loggedUser._id);
    if (!isEmpty(messages)) res.json({ data: messages });
    else throw new NotFound(404, 'No messages!');
  } else {
    throw new UnauthorizedRoute(
      401,
      'You do not have permission to perform this action.',
      "User can only see it's own messages",
    );
  }
};
