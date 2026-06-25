import { BookingFolio } from "@/components/dashboard/BookingFolio";

type PageProps = {
  params: { id: string };
};

export default function BookingFolioPage({ params }: PageProps) {
  return <BookingFolio bookingId={params.id} />;
}
