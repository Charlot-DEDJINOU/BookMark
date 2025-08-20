import mongoose, { Document, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Format d\'email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  versionKey: false
});

// Auto-increment pour l'ID
UserSchema.pre('save', async function(next) {
  if (!this.id) {
    const lastUser = await mongoose.model('User').findOne({}, {}, { sort: { id: -1 } });
    this.id = lastUser ? lastUser.id + 1 : 1;
  }
  next();
});

// Hash du mot de passe avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transformation JSON pour exclure le mot de passe
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user._id;
  delete user.__v;
  return user;
};

export const User = mongoose.model<IUser>('User', UserSchema);