import mongoose from 'mongoose';

const supportedSportTypes = [
  'Cricket',
  'Football',
  'Badminton',
  'Swimming',
  'Multi-Sport',
  'Other'
];

const supportedSourceTypes = ['manual', 'announcement', 'official_schedule', 'api', 'ical', 'other'];

const calendarSportsEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    sportType: {
      type: String,
      enum: supportedSportTypes,
      default: 'Other'
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    competitionName: {
      type: String,
      default: '',
      trim: true
    },
    stageLabel: {
      type: String,
      default: '',
      trim: true
    },
    homeTeam: {
      type: String,
      default: '',
      trim: true
    },
    awayTeam: {
      type: String,
      default: '',
      trim: true
    },
    feedKey: {
      type: String,
      trim: true,
      default: null
    },
    sourceId: {
      type: String,
      trim: true,
      default: null
    },
    sourceName: {
      type: String,
      default: '',
      trim: true
    },
    sourceType: {
      type: String,
      enum: supportedSourceTypes,
      default: 'manual'
    },
    sourceUrl: {
      type: String,
      default: '',
      trim: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    isAutoSynced: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

calendarSportsEventSchema.index({ startDate: 1, endDate: 1, sportType: 1 });
calendarSportsEventSchema.index(
  { feedKey: 1, sourceId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      feedKey: { $exists: true, $type: 'string' },
      sourceId: { $exists: true, $type: 'string' }
    }
  }
);

export const calendarSportTypes = supportedSportTypes;
export const calendarSportSourceTypes = supportedSourceTypes;
export const CalendarSportsEvent = mongoose.model(
  'CalendarSportsEvent',
  calendarSportsEventSchema
);
