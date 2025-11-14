import { FaEnvelope,FaClock } from 'react-icons/fa6';
import { useGetLatestUsers } from '../lib/react-query/QueriesAndMutation';

interface LatestUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}


export function LatestUsers() {
  const {data:users} = useGetLatestUsers();
  return (
    <div className="bg-white mt-6 rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h5 className="text-lg font-semibold text-[#3770bd]">Latest Users</h5>
      </div>
      <div className="divide-y divide-gray-100">
        {users?.map((user:LatestUser) => (
          <div
            key={user.id}
            className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h6 className="font-semibold text-gray-800 truncate">
                      {user.name}
                    </h6>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaEnvelope className="text-[#3770bd] text-xs" />
                    <span className="truncate">{user.email}</span>
                  </div>
                 
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaClock className="text-[#3770bd]" />
                    Created at: {String(user.created_at).split('T')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
