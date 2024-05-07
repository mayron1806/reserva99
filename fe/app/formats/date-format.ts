import moment from "moment"

export const formatDate = (date: Date) => {
  return moment(date).format("DD/MM/YYYY [ás] hh:mm");
}