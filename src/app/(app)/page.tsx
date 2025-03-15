import Image from 'next/image';
import Illustration from '@/public/app/images/glow-bottom.svg';

export const metadata = {
    title: 'Meteo Graph',
    description: '',
};


export default function Home() {
    return (
        <>
            <div className={'relative min-h-screen overflow-auto'}>
                <div className={'absolute inset-0 w-full h-full'}>
                    <div className={'fixed inset-0 w-full h-full'}>
                        <Image src={Illustration} className="w-full object-cover" fill={true}
                               alt="Meteo Graph Application" />
                    </div>
                    <div className={'relative flex justify-center items-center p-4 min-h-screen'}>
                        <div className={'text-center'}>
                            <p>
                                <Image src={'/template/meteo-graph.png'} alt={'Meteo graph logo'}
                                       width={150}
                                       height={150} className={'block mx-auto mb-4 w-[100px] h-auto md:w-[150px]'} />
                            </p>
                            <h1 className="text-3xl font-bold md:text-4xl bg-clip-text text-transparent bg-linear-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4"
                                data-aos="fade-down">Meteo Graph</h1>
                            <h2 className="text-2xl font-bold md:text-3xl bg-clip-text text-transparent bg-linear-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4"
                                data-aos="fade-down">Explore Historical Weather Observations</h2>
                            <p className="text-sm md:text-lg text-slate-300 mb-8" data-aos="fade-down"
                               data-aos-delay="200">
                                Access detailed and structured weather observations derived from historical Météo-France
                                data.<br /> Perfect for research, analytics, and visualization.
                            </p>
                            <div
                                className="max-w-xs mx-auto sm:max-w-none sm:inline-flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                                data-aos="fade-down" data-aos-delay="400">
                                <div>
                                    <a className="btn text-slate-900 bg-linear-to-r from-white/80 via-white to-white/80 hover:bg-white w-full transition duration-150 ease-in-out group"
                                       href="/dashboard">
                                        Meteo Graph Application <span
                                        className="tracking-normal text-blue-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
                                    </a>
                                </div>
                                <div>
                                    <a className="btn text-slate-200 hover:text-white bg-slate-900/25 hover:bg-slate-900/30 w-full transition duration-150 ease-in-out"
                                       href="https://api.meteo-graph.fr">
                                        <svg className="shrink-0 fill-slate-300 mr-3" xmlns="http://www.w3.org/2000/svg"
                                             width="16" height="16">
                                            <path
                                                d="m1.999 0 1 2-1 2 2-1 2 1-1-2 1-2-2 1zM11.999 0l1 2-1 2 2-1 2 1-1-2 1-2-2 1zM11.999 10l1 2-1 2 2-1 2 1-1-2 1-2-2 1zM6.292 7.586l2.646-2.647L11.06 7.06 8.413 9.707zM0 13.878l5.586-5.586 2.122 2.121L2.12 16z" />
                                        </svg>
                                        <span>Meteo Graph API</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


            </div>

        </>
    );
}
