import React from 'react';
import { Card } from './card';
import Image from 'next/image';
import StyledLink from './styledLink';

function Badge({ children, variant = 'default' }) {
    const variants = {
        default: 'border border-[--border]',
        outline: 'border border-[--border]'
    };

    return (
        <span className={`${variants[variant]} text-sm px-2.5 py-0.5 rounded-full inline-flex items-center`}>
            {children}
        </span>
    );
};

export default function ProfileCard({ match }) {
    const {
        name,
        email,
        linkedIn,
        bio,
        availability,
        skills,
        themes,
        needHelp,
        projectName,
        projectDescription,
        projectLink,
        timeFrame
    } = match;

    const firstName = name.split(" ")[0];

    return (
        <Card className="bg-[--bg]">
            <div className="p-3">
                <div className="flex gap-6">
                    <div className="flex-shrink-0">
                        <Image
                            src="/api/placeholder/96/96"
                            alt={`${name}'s profile`}
                            className="rounded-full object-cover ring-2 ring-[--border]"
                            width={96}
                            height={96}
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-[tiempos]">{name}</h1>
                                <div className="flex items-center gap-2 mt-1 text-gray-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="blur-[3px]">{email}</span>
                                </div>
                            </div>
                            <StyledLink
                                href={linkedIn}
                                className="text-lg"
                            >
                                View LinkedIn
                            </StyledLink>
                        </div>
                        <p className="mt-3 text-gray-700">{bio}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h1 className="font-semibold mb-2">Skills</h1>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <Badge key={skill}>{skill}</Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h1 className="font-semibold mb-2">Themes</h1>
                            <div className="flex flex-wrap gap-2">
                                {themes.map((theme) => (
                                    <Badge key={theme} variant="outline">{theme}</Badge>
                                ))}
                            </div>
                        </div>

                        {!needHelp && (
                            <div className="flex items-center gap-2 text-[--light]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Available: {availability}</span>
                            </div>
                        )}
                    </div>

                    {needHelp && (
                        <div className="space-y-4">
                            <div>
                                <h1 className="font-semibold mb-2">Project Details</h1>
                                <StyledLink
                                    href={projectLink}
                                    className="text-lg"
                                >
                                    {projectName}
                                </StyledLink>
                                <p className="mt-2 text-[--light]">{projectDescription}</p>
                            </div>

                            <div className="flex items-center gap-2 text-[--light]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Duration: {timeFrame} months</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};