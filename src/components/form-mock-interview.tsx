import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form";

import type { Interview } from "@/types"

import { CustomBreadCrumb } from "./custom-bread-crumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "./headings";
import { Loader, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { apiClient } from "@/lib/api-client";
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import Modal from "./modal";

interface FormMockInterviewProps{
    initialData: Interview | null
}

const formSchema = z.object({
    position: z
        .string()
        .min(1,"Position is required")
        .max(100,"Position must be 100 characters or less"),
    description: z.string().min(10,"Description is required"),
    experience: z.coerce.number().min(0,"Experience cannot be empty or negative") as any,
    techStack: z.string().min(1,"Tech stack must be atleast a character"),
});

type FormData = z.infer<typeof formSchema>

export const FormMockInterview = ({initialData}: FormMockInterviewProps) => {

    const form = useForm<FormData>(
        {
            resolver : zodResolver(formSchema),
            defaultValues : initialData || {},
        }
    );

    const {isValid, isSubmitting} = form.formState;
    const [loading, setLoading ] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const navigate = useNavigate();
    const { userId, getToken } = useAuth();

    const title = initialData?.position 
        ? initialData?.position
        : "Create a new Mock Interview";

    const breadCrumbPage = initialData?.position 
        ? "Edit"
        : "Create";

    const actions = initialData ? "Save Changes" : "Create";
    const toastMessage = (initialData)
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };
    
    const onSubmit = async (data: FormData) => {
        try{
            setLoading(true);
            if(initialData){
                if(isValid){
                    const { questions } = await apiClient.generateQuestions(getToken, data);
                    await updateDoc(doc(db,"interviews",initialData?.id),{
                        questions,
                        ...data,
                        updatedAt : serverTimestamp()
                    })
                    toast(toastMessage.title,{description : toastMessage.description});
                }
            } else{
                if(isValid){
                    const { questions } = await apiClient.generateQuestions(getToken, data);
                    await addDoc(collection(db,"interviews"), {
                        ...data,
                        userId,
                        questions,
                        createdAt: serverTimestamp()
                    });
                    toast(toastMessage.title,{description : toastMessage.description});
                }
            }
            navigate("/generate", {replace:true});
        } catch(error){
            console.log(error);
            toast.error("Error..",{
                description: `Something went wrong. Please try again later`,
            });
        } finally{
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!initialData) return;
        try {
            setDeleteLoading(true);
            await deleteDoc(doc(db, "interviews", initialData.id));
            toast.success("Deleted", { description: "Interview deleted successfully." });
            navigate("/generate", { replace: true });
        } catch (error) {
            console.error(error);
            toast.error("Error", { description: "Failed to delete interview." });
        } finally {
            setDeleteLoading(false);
            setDeleteOpen(false);
        }
    };

    useEffect(()=>{
        if(initialData){
            form.reset({
                position: initialData.position,
                description: initialData.description,
                experience: initialData.experience,
                techStack: initialData.techStack
            })
        }
    },
    [initialData, form]
    );

    return(
        <div className="w-full flex-col space-y-4">
            {/* Delete confirmation modal */}
            <Modal
                title="Delete Interview?"
                description="This will permanently delete the interview and all saved answers. This action cannot be undone."
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
            >
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button disabled={deleteLoading} variant={"outline"} onClick={() => setDeleteOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={deleteLoading}
                        variant={"destructive"}
                        onClick={handleDelete}
                    >
                        {deleteLoading ? <Loader className="animate-spin" /> : "Delete"}
                    </Button>
                </div>
            </Modal>

            <CustomBreadCrumb 
                breadCrumbPage={breadCrumbPage}
                breadCrumbItems={[{label: "Mock Interviews", link: "/generate"}]}
            />
            <div className="mt-4 flex items-center justify-between w-full">
                <Headings title={title} isSubHeading/>
                {initialData && (
                    <Button
                        size={"icon"}
                        variant={"ghost"}
                        onClick={() => setDeleteOpen(true)}
                        type="button"
                    >
                        <Trash2 className="min-w-4 min-h-4 text-red-500"/>
                    </Button>
                )}
            </div>
            <Separator className="my-4"/>
            <div className="my-6"></div>
            
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-8 rounded-lg flex flex-col items-start justify-start gap-6 shadow-md">
                    <FormField
                         control={form.control}
                         name="position"
                         render={({field})=> 
                           (<FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Job Role / Job Position</FormLabel>
                                    <FormMessage className="text-sm text-red-500"/>
                                </div>
                                <FormControl>
                                    <Input 
                                        disabled={loading}
                                        className="h-12"
                                        placeholder="eg:-Full stack developer"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                            </FormItem>)
                            }
                    />

                    {/* description */}

                    <FormField
                         control={form.control}
                         name="description"
                         render={({field})=> 
                           (<FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Job Description</FormLabel>
                                    <FormMessage className="text-sm text-red-500"/>
                                </div>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        disabled={loading}
                                        className="h-12"
                                        placeholder="eg:-describe your job role or position..."
                                        value={field.value || ""}
                                    />
                                </FormControl>
                            </FormItem>)
                            }
                    />

                    {/* experience */}

                    <FormField
                         control={form.control}
                         name="experience"
                         render={({field})=> 
                           (<FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Years of Experience</FormLabel>
                                    <FormMessage className="text-sm text-red-500"/>
                                </div>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        type="number"
                                        disabled={loading}
                                        className="h-12"
                                        placeholder="eg:-5"
                                        value={field.value || ""}
                                    />
                                </FormControl>
                            </FormItem>)
                            }
                    />

                    {/* tech stack */}

                    <FormField
                         control={form.control}
                         name="techStack"
                         render={({field})=> 
                           (<FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Tech Stacks</FormLabel>
                                    <FormMessage className="text-sm text-red-500"/>
                                </div>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        disabled={loading}
                                        className="h-12"
                                        placeholder="eg:-React, Node.js, TypeScript"
                                        value={field.value || ""}
                                    />
                                </FormControl>
                            </FormItem>)
                            }
                    />
                    <div className="w-full flex items-center justify-end gap-6">
                            <Button type="reset" size={"sm"} variant={"outline"} disabled={isSubmitting || loading}>Reset</Button>
                            <Button type="submit" size={"sm"} disabled={isSubmitting || loading || !isValid}>
                                {loading ? <><Loader className="animate-spin mr-2" /> Generating…</> : actions}
                            </Button>
                    </div>
                </form>
            </FormProvider>
        </div>

    );
};