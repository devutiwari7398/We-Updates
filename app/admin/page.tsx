export default function AdminPage() {
  return (
    <div className="container mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold">
        WeUpdates Admin
      </h1>

      <p className="mt-2 text-gray-500">
        Welcome to Admin Dashboard
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Courses
          </h2>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Students
          </h2>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Orders
          </h2>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Revenue
          </h2>

          <p className="mt-2 text-3xl font-bold">
            ₹0
          </p>
        </div>

      </div>

    </div>
  );
}