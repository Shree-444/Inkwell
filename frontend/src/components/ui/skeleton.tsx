export function DashboardSkeleton() {
  return (
    <div className="mx-auto space-x-10">
      {[1, 2, 3].map((_, i) => (
        <div
          key={i}
          className="py-4 mt-7 rounded-2xl shadow-md w-screen sm:w-200 animate-pulse"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex p-4 space-x-4 sm:px-8">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full"
              style={{ backgroundColor: "var(--muted)" }}
            ></div>
            <div className="flex-1 py-2 space-y-4">
              <div className="w-1/5 h-3 rounded" style={{ backgroundColor: "var(--muted)" }}></div>
              <div className="w-2/7 h-3 rounded" style={{ backgroundColor: "var(--muted)" }}></div>
            </div>
          </div>
          <div className="p-4 space-y-4 sm:px-8">
            <div className="w-full h-4 rounded" style={{ backgroundColor: "var(--muted)" }}></div>
            <div className="w-full h-4 rounded" style={{ backgroundColor: "var(--muted)" }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ShowBlogSkeleton() {
  return (
    <div className="flex justify-center mt-10">
      <div
        className="py-4 rounded-2xl shadow-md w-200 h-150 animate-pulse"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="p-4 space-y-4 sm:px-8">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="w-full h-4 rounded"
              style={{ backgroundColor: "var(--muted)" }}
            ></div>
          ))}
        </div>
        <div className="flex p-4 space-x-4 sm:px-8">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full"
            style={{ backgroundColor: "var(--muted)" }}
          ></div>
          <div className="flex-1 py-2 space-y-4">
            <div className="w-1/5 h-3 rounded" style={{ backgroundColor: "var(--muted)" }}></div>
            <div className="w-2/7 h-3 rounded" style={{ backgroundColor: "var(--muted)" }}></div>
          </div>
        </div>
        <div className="p-4 space-y-10 sm:px-8">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-full h-4 rounded"
              style={{ backgroundColor: "var(--muted)" }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EditProfileSkeleton() {
  return (
    <div className="flex justify-center">
      <div
        className="py-4 rounded-2xl shadow-md w-200 h-150 animate-pulse"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="p-4 space-y-4 sm:px-8">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="w-full h-4 rounded"
              style={{ backgroundColor: "var(--muted)" }}
            ></div>
          ))}
        </div>
        <div className="flex p-4 space-x-4 sm:px-8">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full"
            style={{ backgroundColor: "var(--muted)" }}
          ></div>
          <div className="flex-1 py-2 space-y-4">
            <div className="w-1/5 h-3 rounded" style={{ backgroundColor: "var(--muted)" }}></div>
            <div className="w-2/7 h-3 rounded" style={{ backgroundColor: "var(--muted)" }}></div>
          </div>
        </div>
        <div className="p-4 space-y-10 sm:px-8">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-full h-4 rounded"
              style={{ backgroundColor: "var(--muted)" }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EditBlogSkeleton() {
  return (
    <div className="flex justify-center mr-8">
      <div
        className="py-4 rounded-2xl shadow-md w-200 h-170 animate-pulse"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="p-4 space-y-4 sm:px-8">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="w-full h-4 rounded"
              style={{ backgroundColor: "var(--muted)" }}
            ></div>
          ))}
        </div>
        <div className="flex p-4 space-x-4 sm:px-8">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full"
            style={{ backgroundColor: "var(--muted)" }}
          ></div>
          <div className="flex-1 py-2 space-y-4">
            <div className="w-1/5 h-3 rounded" style={{ backgroundColor: "var(--muted)" }}></div>
            <div className="w-2/7 h-3 rounded" style={{ backgroundColor: "var(--muted)" }}></div>
          </div>
        </div>
        <div className="p-4 space-y-10 sm:px-8">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-full h-4 rounded"
              style={{ backgroundColor: "var(--muted)" }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
