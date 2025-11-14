import { FaBed, FaCalendar, FaCaretUp, FaStar } from 'react-icons/fa6';
import Header from './customs/Header';
import BookingsLineChart from './ui/BookingsLineChart';
import { useGetBookingsTodayCount, useGetRatingTotals } from '../lib/react-query/QueriesAndMutation';
import { LatestUsers } from './LatestUsers';



export function Dashboard() {
  const { data: ratingsData } = useGetRatingTotals();
  const { data: bookingCount } = useGetBookingsTodayCount();
  const ratings = ratingsData?.totals || [];
  const average = ratingsData?.average || 0;

  const ratingsArray = Object.keys(ratings).map((key) => ({
    stars: key,
    count: ratings[key],
    width: ratings[key] ? (ratings[key] / Math.max(...Object.values(ratings))) * 100 : 0,
  }));

  return (
    <div className="h-full w-full p-8 bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
      <Header title="Welcome back, Admin!" />
      <section className="flex flex-1 flex-col relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 w-full">
          <div className="bg-white shadow-lg p-4 flex items-center gap-3 h-30 rounded-lg">
            <FaCalendar className="text-3xl text-[#3770bd] border-r border-slate-200 pr-2" />
            <div>
              <p className="text-gray-500 text-sm">Bookings</p>
              <p className="text-xl font-bold text-gray-800">{bookingCount?.bookings}</p>
            </div>
          </div>
          <div className="bg-white shadow-lg p-4 flex items-center gap-3 h-30 rounded-lg">
            <FaCalendar className="text-3xl text-[#3770bd] border-r border-slate-200 pr-2" />
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
          <div className="bg-white shadow-lg p-4 flex items-center gap-3 rounded-lg">
            <FaStar className="text-3xl text-yellow-400 border-r border-slate-200 pr-2" />
            <div>
              <p className="text-gray-500 text-sm">New Ratings Submitted</p>
              <p className="text-xl font-bold text-gray-800">{bookingCount?.ratings_count}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="card user-list shadow-lg rounded-lg">
            <div className="card-header p-4 border-b">
              <h5 className="text-lg font-semibold text-[#3770bd]">Guest Satisfaction Rating</h5>
            </div>
            <div className="card-body p-4">
              <div className="flex items-center justify-between gap-1 mb-5">
                <h2 className="font-light flex items-center m-0 text-2xl text-gray-800">
                  {average}
                  <FaStar className="text-yellow-400 text-sm ml-2.5" />
                </h2>
                <h6 className="flex items-center m-0 text-green-600">
                  0.4
                  <FaCaretUp className="ml-2.5 text-lg" />
                </h6>
              </div>

              {ratingsArray.reverse().map((r) => (
                <div key={r.stars} className="mb-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h6 className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-xs mr-2.5" />
                      {r.stars}
                    </h6>
                    <h6 className="text-gray-700">{r.count}</h6>
                  </div>
                  <div className="w-full bg-gray-200 rounded-lg h-1.5 mb-3">
                    <div
                      className="h-full rounded-lg shadow-md pelagic-gradient-primary"
                      role="progressbar"
                      style={{ width: `${r.width}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <BookingsLineChart />
        <LatestUsers />

      </section>
    </div>
  );
}