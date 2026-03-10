import HttpError from './httpErrors';

export default class BadRequestError extends HttpError {
  constructor(message = 'Некорректные данные') {
    super(400, message);
  }
}
