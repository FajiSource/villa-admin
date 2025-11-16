import { FaBed, FaCalendar } from 'react-icons/fa6';
import Header from './customs/Header';
import BookingsLineChart from './ui/BookingsLineChart';
import { useGetBookingsTodayCount } from '../lib/react-query/QueriesAndMutation';
import { LatestUsers } from './LatestUsers';



export function Dashboard() {
  const { data: bookingCount } = useGetBookingsTodayCount();

  return (
    <div className="h-full w-full p-8 bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
      <Header title="Welcome back, Admin!" />
      <section className="flex flex-1 flex-col relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 w-full">
          <div className="bg-white shadow-lg p-4 flex items-center gap-3 h-30 rounded-lg">
            <FaCalendar className="text-3xl border-r border-slate-200 pr-2" style={{ color: 'var(--primary-color) ' }} />
            <div>
              <p className="text-gray-500 text-sm">Bookings</p>
              <p className="text-xl font-bold text-gray-800 text-[var(--primary-color)]">{bookingCount?.bookings}</p>
            </div>
          </div>
          <div className="bg-white shadow-lg p-4 flex items-center gap-3 h-30 rounded-lg">
            <FaCalendar className="text-3xl border-r border-slate-200 pr-2" style={{ color: 'var(--primary-color)' }} />
            <div>
              <p className="text-gray-500 text-sm">Today's Bookings</p>
              <p className="text-xl font-bold text-gray-800">{bookingCount?.today_count}</p>
            </div>
          </div>
          <div className="bg-white shadow-lg p-4 flex items-center gap-3 rounded-lg">
            <FaBed className="text-3xl text-green-400 border-r border-slate-200 pr-2" />
            <div>
              <p className="text-gray-500 text-sm">Available Rooms</p>
              <p className="text-xl font-bold text-gray-800">{bookingCount?.rooms}</p>
            </div>
          </div>
        </div>
        <BookingsLineChart />
        <LatestUsers />

      </section>
    </div>
  );
}