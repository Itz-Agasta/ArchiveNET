import { Subscriptions } from '@/components/layout/Subscriptions';
import Navbar from '@/components/ui/Navbar';
export default function GetStartedPage() {
    return (
        <>
            <div className='w-full h-full'>
                <Navbar />
                <div className='my-40'>
                    <Subscriptions />
                </div>
            </div>
        </>
    )
}