import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'super_secret_fallback', {
    expiresIn: '30d',
  });
};

export default generateToken;
