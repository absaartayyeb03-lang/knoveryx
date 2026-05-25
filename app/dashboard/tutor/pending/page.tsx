import { Clock } from "lucide-react";

export default function PendingReview() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
        <Clock className="text-amber-500 w-10 h-10" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Application Under Review</h1>
      <p className="text-gray-500 max-w-md">
        We've received your payment receipt. Our team is verifying your details. 
        This usually takes 24-48 hours. We'll email you once you're approved!
      </p>
    </div>
  );
}