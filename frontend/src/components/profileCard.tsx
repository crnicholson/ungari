import React, { useEffect, useState } from 'react';
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
}

function DesktopProfileCard({ match }) {
    const {
        name,
        linkedIn,
        bio,
        availability,
        skills,
        themes,
        needHelp,
        projectName,
        projectDescription,
        projectLink,
        timeFrame,
        imageLink
    } = match;

    return (
        <Card className="bg-[--bg] w-full">
            <div className="p-3">
                <div className="flex gap-6">
                    <div className="flex-shrink-0">
                        <Image
                            src={imageLink}
                            alt={`${name}'s profile`}
                            className="rounded-full object-cover ring-2 ring-[--border]"
                            width={96}
                            height={96}
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <h1 className="text-2xl font-[family-name:var(--tiempos)]">{name}</h1>
                            <StyledLink href={linkedIn} className="text-md">
                                View LinkedIn
                            </StyledLink>
                        </div>
                        <p className="mt-3">{bio}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-6">
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
                                <StyledLink href={projectLink} className="text-md">
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
}

function MobileProfileCard({ match }) {
    const {
        name,
        linkedIn,
        bio,
        availability,
        skills,
        themes,
        needHelp,
        projectName,
        projectDescription,
        projectLink,
        timeFrame,
        imageLink
    } = match;

    return (
        <Card className="bg-[--bg] w-full">
            <div className="relative h-32 bg-[--accent] rounded-t-xl">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <Image
                        src={imageLink}
                        alt={`${name}'s profile`}
                        className="rounded-full object-cover ring-4 ring-[--card-bg]"
                        width={96}
                        height={96}
                    />
                </div>
            </div>

            <div className="pt-16 px-4">
                <div className="text-center">
                    <h1 className="text-xl font-[family-name:var(--tiempos)] mb-2">{name}</h1>
                    <p className="text-sm text-[--light] mb-4">{bio}</p>
                    <StyledLink href={linkedIn} className="text-sm inline-block mb-6">
                        View LinkedIn
                    </StyledLink>
                </div>

                {!needHelp && (
                    <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 mb-6">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Available: {availability}</span>
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-sm font-semibold mb-3 text-center">Skills</h2>
                    <div className="flex flex-wrap justify-center gap-2">
                        {skills.map((skill) => (
                            <Badge key={skill}>{skill}</Badge>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-sm font-semibold mb-3 text-center">Themes</h2>
                    <div className="flex flex-wrap justify-center gap-2">
                        {themes.map((theme) => (
                            <Badge key={theme} variant="outline">{theme}</Badge>
                        ))}
                    </div>
                </div>

                {needHelp && (
                    <div className="border-t border-[--border] pt-6">
                        <h2 className="text-sm font-semibold mb-3 text-center">Project</h2>
                        <div className="text-center">
                            <StyledLink href={projectLink} className="text-lg mb-2 inline-block">
                                {projectName}
                            </StyledLink>
                            <p className="text-sm text-[--light] mb-4">{projectDescription}</p>
                            <div className="flex items-center justify-center gap-2 text-[--light]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{timeFrame} months</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default function ProfileCard({ match }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth < 768);

            const handleResize = () => {
                setIsMobile(window.innerWidth < 768);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return isMobile ? (
        <MobileProfileCard match={match} />
    ) : (
        <DesktopProfileCard match={match} />
    );
}