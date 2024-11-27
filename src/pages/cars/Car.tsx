import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import axiosInstance from "@/utils/AxiosInstance";
import { Switch } from "@/components/ui/switch"
import { CarFront, Edit, Fuel, GalleryHorizontal, Milestone, Palette, Plus, Ratio, Save, SquareLibrary, Trash, View, X, Zap } from "lucide-react";


const Car = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [editable, setEditable] = useState<boolean | undefined>(false);
    const [isAvailable, setIsAvailable] = useState(false);

    const {
        data: car,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["car", id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/cars/${id}`);
            console.log(res.data)
            return res.data;
        },
    });

    const handleSwitchChange = () => {
        setIsAvailable((prev) => !prev);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div className="details px-4 py-2">
                <div className="header flex justify-between mb-4 items-center border-b pb-2 border-b-gray-300/75">
                    <div className="flex items-center justify-center gap-x-4">
                        <h1 className="text-xl font-bold">{car?.name}
                        </h1>
                        {
                            !editable &&
                            <>
                                {
                                    car.isAvailable ? <span className="bg-green-600 text-white font-bold py-1 px-2 rounded-full shadow-lg shadow-green-400">Available</span> : <span className="bg-red-600 text-white font-bold py-1 px-2 rounded-full shadow-lg shadow-red-400">Rented</span>
                                }
                            </>
                        }
                        {editable && (
                            <div className="flex items-center gap-x-2">
                                <p className="font-medium">{isAvailable ? <span className="bg-green-600 text-white font-bold py-1 px-2 rounded-full shadow-lg shadow-green-400">Available</span> : <span className="bg-red-600 text-white font-bold py-1 px-2 rounded-full shadow-lg shadow-red-400">Rented</span>
                                }</p>
                                <Switch checked={isAvailable} onCheckedChange={handleSwitchChange} />
                            </div>
                        )}

                    </div>
                    <div className="flex gap-x-2">
                        {editable && <Button className="rounded-full" variant={"outline"} onClick={() => setEditable(false)}><X /></Button>}
                        {!editable && <Button className="rounded-full" variant={"outline"} onClick={() => setEditable(true)}><Edit /></Button>}
                        {editable && <Button className="rounded-full" variant={"outline"} onClick={() => { }}><Save /></Button>}

                        <Button className="bg-red-600 rounded-full"><Trash /></Button>
                    </div>
                </div>

                <div>
                    <div className="pb-12">
                        <p className="font-bold pb-1 border-b border-b-gray-100 mb-2">Description</p>
                        <input type="text" placeholder={car?.description} disabled={!editable}
                            className={`placeholder:text-black border rounded-md px-2 outline-none focus:border-black
                             transition ease-in-out w-full py-2 ${editable ? "placeholder:font-normal border-gray-400" : "border-transparent"}
                              disabled:bg-transparent bg-transparent`} />
                    </div>

                    <div>
                        <p className="font-bold pb-1 border-b border-b-gray-100 mb-2">Car Details</p>
                        <InfoRow editable={editable} onChange1={() => { }} onChange2={() => { }} label1="Fuel" value1={car.fuel} Icon1={Fuel} label2="Category" value2={car.category} Icon2={SquareLibrary} />
                        <InfoRow editable={editable} onChange1={() => { }} onChange2={() => { }} label1="Color" value1={car.color} Icon1={Palette} label2="Engine Displacement" value2={`${car.engineDisplacement} ccm`} Icon2={CarFront} />
                        <InfoRow editable={editable} onChange1={() => { }} onChange2={() => { }} label1="Power" value1={`${car.power} kW`} Icon1={Zap} label2="Mileage" value2={`${car.mileage} km`} Icon2={Milestone} />
                        <InfoRow editable={editable} onChange1={() => { }} onChange2={() => { }} label1="Seats" value1={`${car.seats} seats`} Icon1={GalleryHorizontal} label2="Specification" value2={car.specification} Icon2={Ratio} />
                    </div>
                </div>

            </div>

            <div className="imgs flex flex-col mt-4 px-4 py-2">
                <p className="font-bold pb-1 border-b border-b-gray-100 mb-2">Car Gallery</p>
                <div className="flex gap-x-4 flex-wrap">
                    {
                        car?.images.map((img: { link: string, carId: string }) => (
                            <Dialog key={img.link}>
                                <DialogTrigger asChild>
                                    <div
                                        className="relative rounded-md overflow-hidden cursor-pointer"
                                        onClick={() => setSelectedImage(img.link)}
                                    >
                                        <div className="flex opacity-0 hover:opacity-100 transition ease-in-out justify-center items-center absolute top-0 left-0 w-full h-full hover:bg-black/25 bg-transparent">
                                            <div className="flex gap-x-2">
                                                <Button className="rounded-full" variant={"outline"}>
                                                    <View />
                                                </Button>
                                            </div>
                                        </div>
                                        <img src={img.link} alt="Car" className="rounded-md object-cover h-[150px]" />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg">
                                    <img src={selectedImage} alt="Car Large View" className="rounded-lg object-cover w-full h-auto" />

                                    <div className="flex justify-between gap-x-2">
                                        <Button className="rounded-full" >
                                            Change
                                            {/* <View /> */}
                                        </Button>
                                        <Button className="bg-red-600 rounded-full">
                                            <Trash />
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))
                    }
                    {
                        editable && (
                            <div className="relative rounded-md overflow-hidden">
                                <div className="bg-gray-50/50 hover:bg-gray-50 cursor-pointer border-dashed border border-gray-500 h-full w-[200px] flex justify-center items-center">
                                    <div className="flex justify-center items-center flex-col">
                                        <p>Add New</p>
                                        <Button className="rounded-full" variant={"outline"}><Plus /></Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default Car;

type InfoRowType = {
    label1?: string;
    value1?: string;
    label2?: string;
    value2?: string;
    editable?: boolean;
    Icon1?: React.ElementType;
    Icon2?: React.ElementType;
    onChange1?: () => void;
    onChange2?: () => void;
}

const InfoRow = ({ label1, value1, label2, value2, editable = false, Icon1, Icon2 }: InfoRowType) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-16`}>
            <label htmlFor={label1} className="w-full flex items-center justify-between bg-gray-50/50 my-2 p-2 rounded-md">
                <p className="flex items-center gap-x-2"><span className="p-1 rounded-md">
                    {Icon1 && <Icon1 />}
                </span> {label1}</p>
                <input type="text" id={label1} name={label1} placeholder={value1} disabled={!editable} className={`placeholder:text-black border  rounded-md px-2 outline-none focus:border-black transition ease-in-out ${editable ? "placeholder:font-normal border-gray-400" : "placeholder:font-bold border-transparent"}   disabled:bg-transparent text-right bg-transparent`} />
            </label>
            <label htmlFor={label2} className="w-full flex items-center justify-between bg-gray-50/50 my-2 p-2 rounded-md">
                <p className="flex items-center gap-x-2"><span className="p-1 rounded-md">
                    {Icon2 && <Icon2 />}
                </span> {label2}</p>
                <input type="text" id={label2} name={label2} placeholder={value2} disabled={!editable} className={`placeholder:text-black border rounded-md px-2 outline-none focus:border-black transition ease-in-out ${editable ? "placeholder:font-normal border-gray-400" : "placeholder:font-bold border-transparent"}   disabled:bg-transparent text-right bg-transparent`} />
            </label>
        </div>
    )
}