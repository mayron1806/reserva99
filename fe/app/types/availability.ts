export type TimeAvailability = {
  time: Date;
  available: boolean;
}
export type Availability = {
  start: Date;
  end: Date;
  times: TimeAvailability[];
}