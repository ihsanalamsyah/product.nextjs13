'use client'

import { useState, SyntheticEvent, use } from "react";
import { useRouter } from "next/navigation";
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { setCookie } from '../../utils/cookies';


const route = process.env.NEXT_PUBLIC_ROUTE;
function classNames(...classes : any) {
    return classes.filter(Boolean).join(' ')
}


export default function SignIn(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const [isMutating, setIsMutating] = useState(false);

    function resetForm(){
        setName("");
        setEmail("");
        setPassword("");
        document.getElementById("dropdown-gender")!.innerHTML = `Choose Gender<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" class="-mr-1 h-5 w-5 text-gray-400"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>`;
        document.getElementById("dropdown-role")!.innerHTML = `Choose Role<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" class="-mr-1 h-5 w-5 text-gray-400"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>`;      
    }
    function handleChange(){
        setModal(!modal);
    }
    function handleGender(value: string){
        setGender(value);
        document.getElementById("dropdown-gender")!.innerHTML = `${value}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" class="-mr-1 h-5 w-5 text-gray-400"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>`;      
    }
    function handleRole(value: string){
        setRole(value);
        document.getElementById("dropdown-role")!.innerHTML = `${value}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" class="-mr-1 h-5 w-5 text-gray-400"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>`;      
    }
  
    async function handleSubmit(e: SyntheticEvent){
        e.preventDefault();
        setIsMutating(true);
        const response = await fetch(`${route}/signin`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                gender: gender,
                password: password,
                role: role
            })
        });
        const content = await response.json();
        if(content.status == "OK"){
            setIsMutating(false);
            router.refresh();
            setModal(false);
            resetForm();
            setCookie("token", content.token, 7);
            setCookie("name", content.data.name, 7);
            setCookie("role", content.data.role, 7);
            return router.push(`products/`);  
        }
        else{
            setIsMutating(false);
            router.refresh();
            setModal(false);
            alert(content.msg);
            resetForm();
            return router.push("/");
        }
        
    }
    return (
        <div>
            <button className="btn mx-2" onClick={handleChange}>Sign In</button>

            <input type="checkbox" checked={modal} onChange={handleChange} className="modal-toggle" />


            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Sign In User</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label font-bold">Name</label>
                            <input 
                            type="text" 
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            className="input w-full input-bordered"  
                            placeholder="Name"/>
                        </div>
                        <div className="form-control">
                            <label className="label font-bold">Email</label>
                            <input 
                            type="text" 
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            className="input w-full input-bordered" 
                            placeholder="Email" />
                        </div>
                        <div>
                            <label className="label font-bold">Gender</label>
                            <Menu as="div" className="relative inline-block text-left my-2">
                                <div>
                                    <Menu.Button id="dropdown-gender" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    Choose Gender
                                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <Menu.Item>
                                        {({ active }) => (
                                            <a
                                            onClick={() => handleGender("Male")}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                            >
                                            Male
                                            </a>
                                        )}
                                        </Menu.Item>
                                        <Menu.Item>
                                        {({ active }) => (
                                            <a
                                            onClick={() => handleGender("Female")}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                            >
                                            Female
                                            </a>
                                        )}
                                        </Menu.Item>
                                        
                                    </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                       
                        <div className="form-control">
                            <label className="label font-bold">Password</label>
                            <input 
                            type="text" 
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            className="input w-full input-bordered" 
                            placeholder="Password" />
                        </div>
                        <div>
                            <label className="label font-bold">Role</label>
                            <Menu as="div" className="relative inline-block text-left my-2">
                                <div>
                                    <Menu.Button id="dropdown-role" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    Choose Role
                                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <Menu.Item>
                                        {({ active }) => (
                                            <a
                                            onClick={() => handleRole("Admin")}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                            >
                                            Admin
                                            </a>
                                        )}
                                        </Menu.Item>
                                        <Menu.Item>
                                        {({ active }) => (
                                            <a
                                            onClick={() => handleRole("User")}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                            >
                                            User
                                            </a>
                                        )}
                                        </Menu.Item>
                                        
                                    </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>

                       
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={handleChange}>
                                Close
                            </button>
                            {!isMutating ? (
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                            ) : (
                            <button type="button" className="btn loading">
                                Saving...
                            </button>
                            )}
                           
                          
                        </div>
                        
                    </form>
                </div>
            </div>

        </div>
    )
}