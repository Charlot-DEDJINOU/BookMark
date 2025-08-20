import mongoose, { Document, Schema } from 'mongoose';

export type BookmarkStatus = 'unread' | 'read' | 'reading';

export interface IBookmark extends Document {
  id: number;
  title: string;
  url: string;
  category: string;
  status: BookmarkStatus;
  userId: number;
  created_at: Date;
  updated_at: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  id: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    minlength: [1, 'Le titre ne peut pas être vide'],
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  url: {
    type: String,
    required: [true, 'L\'URL est requise'],
    match: [/^https?:\/\/.+/, 'Format d\'URL invalide']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    trim: true,
    minlength: [1, 'La catégorie ne peut pas être vide'],
    maxlength: [50, 'La catégorie ne peut pas dépasser 50 caractères']
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'reading'],
    default: 'unread'
  },
  userId: {
    type: Number,
    required: true,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  versionKey: false
});

// Auto-increment pour l'ID
BookmarkSchema.pre('save', async function(next) {
  if (!this.id) {
    const lastBookmark = await mongoose.model('Bookmark').findOne({}, {}, { sort: { id: -1 } });
    this.id = lastBookmark ? lastBookmark.id + 1 : 1;
  }
  
  if (this.isModified() && !this.isNew) {
    this.updated_at = new Date();
  }
  
  next();
});

// Index pour optimiser les requêtes
BookmarkSchema.index({ userId: 1 });
BookmarkSchema.index({ category: 1 });
BookmarkSchema.index({ status: 1 });

// Transformation JSON
BookmarkSchema.methods.toJSON = function() {
  const bookmark = this.toObject();
  delete bookmark._id;
  delete bookmark.__v;
  delete bookmark.userId;
  return bookmark;
};

export const Bookmark = mongoose.model<IBookmark>('Bookmark', BookmarkSchema);