import {
  PresentationChartLineIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

const userRoles = {
  admin: "Admin",
  manager: "Manager",
  employee: "Employee",
};

const Dashboard = () => {
  // Assuming the user's role is retrieved from the application state or context
  const userRole = userRoles.admin;

  return (
    <div className='bg-gray-100 min-h-screen'>
      <header className='bg-white shadow-md py-4 px-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
          <div className='flex items-center space-x-4'>
            <UserCircleIcon className='text-gray-500 h-6 w-6' />
            <span className='text-gray-600'>{userRole}</span>
          </div>
        </div>
      </header>

      <main className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white shadow-md rounded-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-bold'>Sales</h3>
                <p className='text-gray-500'>Total sales this month</p>
              </div>
              <PresentationChartLineIcon className='text-blue-500 h-8 w-8' />
            </div>
            <p className='text-3xl font-bold mt-4'>$125,000</p>
          </div>

          <div className='bg-white shadow-md rounded-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-bold'>Orders</h3>
                <p className='text-gray-500'>Total orders this month</p>
              </div>
              <ShoppingBagIcon className='text-green-500 h-8 w-8' />
            </div>
            <p className='text-3xl font-bold mt-4'>1,250</p>
          </div>

          {userRole === userRoles.admin && (
            <div className='bg-white shadow-md rounded-lg p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-bold'>Users</h3>
                  <p className='text-gray-500'>Total users in the system</p>
                </div>
                <UsersIcon className='text-purple-500 h-8 w-8' />
              </div>
              <p className='text-3xl font-bold mt-4'>250</p>
            </div>
          )}
        </div>

        {userRole === userRoles.admin && (
          <div className='mt-6'>
            <h2 className='text-xl font-bold mb-4'>User Management</h2>
            {/* Add user management functionality here */}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
