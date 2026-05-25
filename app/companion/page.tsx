import { getAllCompanions } from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import { getSubjectColor } from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";

// 1. Define the interface for the search parameters
// Next.js 15 requires searchParams to be a Promise
interface SearchParamsProps {
  searchParams: Promise<{
    subject?: string;
    topic?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

// 2. Use the defined interface in the component
const CompanionsLibrary = async ({ searchParams }: SearchParamsProps) => {
    // 3. Await the promise to get the actual values
    const filters = await searchParams;
    const subject = typeof filters.subject === 'string' ? filters.subject : '';
    const topic = typeof filters.topic === 'string' ? filters.topic : '';

    const companions = await getAllCompanions({ subject, topic });

    return (
        <main className="max-w-7xl mx-auto p-6">
            <section className="flex justify-between gap-4 max-sm:flex-col mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Companion Library</h1>
                <div className="flex gap-4 flex-col sm:flex-row">
                    <SearchInput placeholder="Search your companions..." />
                    <SubjectFilter />
                </div>
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companions.length > 0 ? (
                    companions.map((companion) => (
                        <CompanionCard
                            key={companion.id}
                            {...companion}
                            color={getSubjectColor(companion.subject)}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">No companions found for this selection.</p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default CompanionsLibrary;