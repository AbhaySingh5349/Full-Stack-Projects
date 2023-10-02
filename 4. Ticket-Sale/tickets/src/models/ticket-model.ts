import mongoose from 'mongoose';

// interface to describe properties required to create new Ticket
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

// interface to describe properties that Ticket document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// interface to describe properties that Ticket model has
interface TicketModelAttributes extends mongoose.Model<TicketDoc> {
  build(attributes: TicketAttributes): TicketDoc;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // properties to help mongoose to take Ticket doc and turn it into JSON as 'return object'
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

TicketSchema.statics.build = (attributes: TicketAttributes) => {
  return new Ticket(attributes);
};

// DOCUMENT MIDDLEWARE (this object points to document, do not work with update)
TicketSchema.pre('save', async function (next) {
  // Only run this function if price was actually modified otherwise we will hash already hashed price
  if (!this.isModified('title') && !this.isModified('price')) return next();

  next();
});

// <> arguements to function "model", instead of being data-type or actual values, they are "type"
const Ticket = mongoose.model<TicketDoc, TicketModelAttributes>(
  'Ticket',
  TicketSchema
);

export { Ticket };
