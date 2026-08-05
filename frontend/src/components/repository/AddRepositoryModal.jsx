// frontend/src/components/repository/AddRepositoryModal.jsx

import React, { useState } from 'react';
import {
    FaGithub,
    FaTimes,
    FaSpinner,
    FaLink
} from 'react-icons/fa';

import Button from '../common/Button';
import Card from '../common/Card';

const AddRepositoryModal = ({
    isOpen,
    onClose,
    onAdd,
    loading
}) => {

    const [repositoryUrl,
        setRepositoryUrl] =
        useState('');

    const [error,
        setError] =
        useState('');

    if (!isOpen)
        return null;

    const validateGithubUrl =
        (url) => {

            const pattern =
                /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/;

            return pattern
                .test(url);
        };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            setError('');

            if (
                !repositoryUrl
                    .trim()
            ) {

                setError(
                    'Repository URL is required'
                );

                return;
            }

            if (
                !validateGithubUrl(
                    repositoryUrl
                )
            ) {

                setError(
                    'Please enter a valid GitHub repository URL'
                );

                return;
            }

            try {

                await onAdd(
                    repositoryUrl
                );

                setRepositoryUrl(
                    ''
                );

                onClose();

            }
            catch (err) {

                setError(

                    err.response
                        ?.data
                        ?.message ||

                    'Failed to add repository'
                );
            }
        };

    return (

        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
            p-4
        ">

            <Card className="
                w-full
                max-w-lg
                bg-[#111827]
                border
                border-gray-800
                shadow-2xl
            ">

                {/* Header */}

                <div className="
                    flex
                    items-center
                    justify-between
                    mb-6
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            p-3
                            rounded-xl
                            bg-emerald-500/10
                        ">
                            <FaGithub
                                className="
                                    text-emerald-400
                                    text-xl
                                "
                            />
                        </div>

                        <div>
                            <h2 className="
                                text-xl
                                font-bold
                                text-white
                            ">
                                Add Repository
                            </h2>

                            <p className="
                                text-sm
                                text-gray-400
                            ">
                                Import a GitHub repository
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={
                            onClose
                        }
                        className="
                            text-gray-500
                            hover:text-white
                            transition
                        "
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* Form */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        space-y-5
                    "
                >

                    <div>

                        <label className="
                            block
                            mb-2
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                            GitHub Repository URL
                        </label>

                        <div className="
                            relative
                        ">

                            <FaLink
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-500
                                "
                            />

                            <input
                                type="text"
                                value={
                                    repositoryUrl
                                }
                                onChange={
                                    (e)=>
                                    setRepositoryUrl(
                                        e.target.value
                                    )
                                }
                                placeholder="
https://github.com/facebook/react
"
                                className="
                                    w-full
                                    pl-12
                                    pr-4
                                    py-3
                                    rounded-xl
                                    bg-[#030712]
                                    border
                                    border-gray-800
                                    text-white
                                    placeholder-gray-500
                                    focus:outline-none
                                    focus:border-emerald-500
                                    focus:ring-2
                                    focus:ring-emerald-500/20
                                "
                            />

                        </div>

                        <p className="
                            mt-2
                            text-xs
                            text-gray-500
                        ">
                            Example:
                            https://github.com/facebook/react
                        </p>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="
                            p-3
                            rounded-lg
                            bg-red-500/10
                            border
                            border-red-500/20
                            text-red-400
                            text-sm
                        ">
                            {error}
                        </div>
                    )}


                    {/* Buttons */}

                    <div className="
                        flex
                        justify-end
                        gap-3
                        pt-2
                    ">

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={
                                onClose
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={
                                loading
                            }
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            {loading && (
                                <FaSpinner
                                    className="
                                        animate-spin
                                    "
                                />
                            )}

                            {
                                loading
                                ?
                                'Adding...'
                                :
                                'Add Repository'
                            }

                        </Button>

                    </div>

                </form>

            </Card>

        </div>
    );
};

export default AddRepositoryModal;