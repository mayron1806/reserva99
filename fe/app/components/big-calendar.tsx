import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment/moment";
import 'moment/locale/pt-br';
import { ReserveItem } from "~/types/schedule";
import React from "react";
import { WeekTime } from "~/types/time";
moment.locale("pt-br");

const localizer = momentLocalizer(moment);
type Props = {
  reserves?: ReserveItem[];
  defaultDate?: Date;
  weekTime?: WeekTime;
  onSelectReserve?: (id: string) => void;
}

const BigCalendar = ({ reserves, defaultDate, weekTime, onSelectReserve }: Props) => {
 
  const isDisableRange = (date: Date): boolean => {
    if (!weekTime) return false;
    const weekDay = moment(date).clone().locale('en').format('dddd').toLowerCase() as keyof typeof weekTime;
    const dayTimes = weekTime?.[weekDay];
    if (!dayTimes || dayTimes?.length === 0) return true;
    let disable = false;
    dayTimes?.forEach(d => {
      const startHour = parseInt(d.start.slice(0, 2));  
      const startMin = parseInt(d.start.slice(3, 5));
      const endtHour = parseInt(d.end.slice(0, 2)); 
      const endMin = parseInt(d.end.slice(3, 5));
      const start = moment(date).hour(startHour).minute(startMin);
      const end = moment(date).hour(endtHour).minute(endMin);
      if (moment(date).isBetween(start, end, undefined, '[)')) {
        disable = true;
      }
    });
    return !disable;
  }

  return (
    <Calendar
      localizer={localizer}
      style={{ height: "100vh" }}
      culture="pt-BR"
      events={reserves?.map(r => ({ 
        title: !r.service.containVariants ? r.service.name : `${r.service.name} - ${r.variant?.name}`, 
        start: moment(r.startDate).toDate(), 
        end: moment(r.endDate).toDate(),
        allDay: false,
        resource: {id: r.id}
      } as Event))}
      onSelectEvent={(e) => onSelectReserve?.(e.resource.id)}
      defaultView="week"
      step={15}
      defaultDate={defaultDate}
      components={{
        timeSlotWrapper: (props: { children: React.ReactNode, value: Date }) => {
          if (!isDisableRange(props.value)) {
            return props.children;
          }
          const child = React.Children.only(props.children);
          if (child) return React.cloneElement(child, { className: child.props.className + ' rbc-off-range-bg' });
        }
      }}
      views={['agenda', 'day', "week"]}
      onNavigate={console.log}
      messages={{
        next: "Proximo",
        previous: "Anterior",
        today: "Hoje",
        month: "Mês",
        week: "Semana",
        day: "Día",
        showMore: (count) => `+${count} a mais`,
      }}
    />
  );
}
 
export default BigCalendar;