// Route Suspense fallback: visually silent. The pixel-mountain transition keeps the page covered until this is gone
// (it watches [data-route-loading]), so no loading state ever flashes; the status stays for screen readers.
export default function Loading() {
  return (
    <div data-route-loading className="min-h-[60vh]">
      <p role="status" className="sr-only">
        Loading
      </p>
    </div>
  );
}
