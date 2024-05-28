import { Calendar, momentLocalizer, Event, DateCellWrapperProps } from "react-big-calendar";
import moment from "moment/moment";
import 'moment/locale/pt-br';
import { ReserveItem } from "~/types/schedule";
import React from "react";
import { Days, WeekTime, daysOfWeek } from "~/types/time";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
moment.locale("pt-br");

const localizer = momentLocalizer(moment);
type Props = {
  reserves?: ReserveItem[];
  defaultDate?: Date;
  weekTime?: WeekTime;
  onDateChange?: (date: Date) => void;
  onSelectReserve?: (id: string) => void;
}
const viewTab = {
  'week': 'Semana',
  'day': 'Dia',
  'agenda': 'Agenda',
}
const BigCalendar = ({ reserves, defaultDate = new Date(), weekTime, onSelectReserve, onDateChange }: Props) => {
 
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
  const getMinAndMaxDateRange = () => {
    let minTime: string | undefined;
    let maxTime: string | undefined;
    Object.keys(daysOfWeek).forEach((d) => {
      const day = d as Days;
      if (weekTime && weekTime[day] && weekTime[day]!.length > 0) {
        weekTime[day]!.forEach(time => {
          const startTime = new Date(`2000-01-01T${time.start}`);
          const endTime = new Date(`2000-01-01T${time.end}`);
          if (!minTime || startTime < new Date(`2000-01-01T${minTime}`)) {
            minTime = time.start;
          }
          if (!maxTime || endTime > new Date(`2000-01-01T${maxTime}`)) {
            maxTime = time.end;
          }
        });
      }
    });
    
    if (minTime && maxTime) {
      const min = moment(defaultDate).clone().set('h', parseInt(minTime!.slice(0, 2))).set('minutes', parseInt(minTime!.slice(3, 5)));
      const max = moment(defaultDate).clone().set('h', parseInt(maxTime!.slice(0, 2))).set('minutes', parseInt(maxTime!.slice(3, 5)));
      max.add(1, 'h');
      return { min: min.toDate(), max: max.toDate() };
    }
    return {
      min: moment(defaultDate).startOf('day').toDate(),
      max: moment(defaultDate).endOf('day').toDate()
    }
  }
  const { max, min } = getMinAndMaxDateRange();
  
  return (
    <Calendar
      localizer={localizer}
      style={{ height: "100vh",  }}
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
        toolbar: ({ views, view, onView, label, onNavigate }) => {
          return (
            <div className="flex justify-between items-center gap-4 mb-4 flex-col md:flex-row">
              <Tabs value={view} defaultValue={view} onValueChange={(v) => onView(v as any)}>
                <TabsList>
                  {
                    (views as []).map(v => (
                      <TabsTrigger key={v} value={v}>{viewTab[v]}</TabsTrigger>
                    ))
                  }
                </TabsList>
              </Tabs>
              <h2>{label}</h2>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => onNavigate('PREV')}>Anterior</Button>
                <Button variant="outline" onClick={() => onNavigate('TODAY')}>Hoje</Button>
                <Button variant="outline" onClick={() => onNavigate('NEXT')}>Proximo</Button>
              </div>
            </div>
          );
        },
        // @ts-ignore
        timeSlotWrapper: (props: { children: React.ReactNode, value: Date }) => {
          if (!isDisableRange(props.value)) {
            return props.children;
          }
          const child = React.Children.only(props.children);
          // @ts-ignore
          if (child) return React.cloneElement(child, { className: child.props.className + ' rbc-off-range-bg' });
        },

      }}
      min={min}
      max={max}
      views={['agenda', 'day', "week"]}
      onNavigate={(date) => onDateChange?.(date)}
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