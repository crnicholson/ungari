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

function ExpandableText({ text, maxLength = 100, className = '' }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    const displayText = isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');

    return (
        <div>
            <p className={`text-[--light] ${className}`}>{displayText}</p>
            {text.length > maxLength && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[--accent] hover:underline mt-1 focus:outline-none"
                >
                    {isExpanded ? 'Show Less' : 'Show More'}
                </button>
            )}
        </div>
    );
}

function SkillLevel({ level }) {
    const colors = [
        'bg-red-500', // Level 1
        'bg-orange-500', // Level 2
        'bg-yellow-500', // Level 3
        'bg-lime-500', // Level 4
        'bg-green-500', // Level 5
    ];

    const width = `${(level / 5) * 100}%`; // Calculate width based on level

    return (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
                className={`h-full ${colors[level - 1]}`}
                style={{ width }}
            ></div>
        </div>
    );
}

function DesktopProfileCard({ user }) {
    const {
        match_id,
        name,
        email,
        linkedIn,
        x,
        gitHub,
        personalWebsite,
        image,
        bio,
        country,
        city,
        availability,
        needHelp,
        projectName,
        projectDescription,
        helpDescription,
        projectLink,
        timeFrame,
        skills,
        skillLevels,
        themes,
    } = user;

    console.log(timeFrame);

    return (
        <Card className="bg-[--bg] w-full rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-[--border]">
                <div className="flex gap-6">
                    <div className="flex-shrink-0">
                        <Image
                            src={image}
                            alt={`${name}'s profile`}
                            className="rounded-full object-cover ring-2 ring-[--border]"
                            width={96}
                            height={96}
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <StyledLink href={`/user?_id=${match_id}`} className="text-3xl font-[family-name:var(--tiempos)] font-bold">{name}</StyledLink>
                        </div>
                        <ExpandableText className="mt-2" text={bio} />
                    </div>
                </div>
            </div>

            <div className="p-8 border-b border-[--border]">
                <h1 className="text-xl font-semibold mb-4">Personal Information</h1>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[--light]">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span>{country === "Prefer not to say" ? "Prefer not to say" : `${city}, ${country}`}</span>
                    </div>

                    {linkedIn && (
                        <div className="flex items-center gap-2 text-[--light]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            <StyledLink href={linkedIn}>LinkedIn</StyledLink>
                        </div>
                    )}

                    {gitHub && (
                        <div className="flex items-center gap-2 text-[--light]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            <StyledLink href={gitHub}>GitHub</StyledLink>
                        </div>
                    )}

                    {x && (
                        <div className="flex items-center gap-2 text-[--light]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <StyledLink href={x}>X (Twitter)</StyledLink>
                        </div>
                    )}

                    {personalWebsite && (
                        <div className="flex items-center gap-2 text-[--light]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <StyledLink href={personalWebsite}>Personal Website</StyledLink>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 border-b border-[--border]">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h1 className="text-xl font-semibold mb-4">
                            Skills {needHelp ? "they need" : "they have"}
                        </h1>
                        <div className="space-y-3">
                            {skills.map((skill) => (
                                <div key={skill}>
                                    <span className="text-[--light]">{skill}</span>
                                    <SkillLevel level={skillLevels[skill]} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold  mb-4">Themes {needHelp ? "of their project" : "they want to work on"}</h1>
                        <div className="flex flex-wrap gap-2">
                            {themes.map((theme) => (
                                <Badge key={theme} variant="outline">{theme}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {!needHelp ? (
                    <div className="flex items-center gap-2 text-[--light]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Available: {availability}</span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-xl font-semibold mb-4">Project Details</h1>
                            <StyledLink href={projectLink} className="text-lg font-semibold">
                                {projectName}
                            </StyledLink>
                            <ExpandableText className="mt-2" text={projectDescription} />
                        </div>

                        <div>
                            <h1 className="text-lg font-semibold">Help Needed</h1>
                            <ExpandableText className="mt-2" text={helpDescription} />
                        </div>

                        <div className="flex items-center gap-2 text-[--light]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Duration: {timeFrame} months</span>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

function MobileProfileCard({ user }) {
    const {
        match_id,
        name,
        email,
        linkedIn,
        x,
        gitHub,
        personalWebsite,
        image,
        bio,
        country,
        city,
        availability,
        needHelp,
        projectName,
        projectDescription,
        helpDescription,
        projectLink,
        timeFrame,
        skills,
        skillLevels,
        themes,
    } = user;

    return (
        <Card className="bg-[--bg] w-full rounded-xl shadow-lg overflow-hidden">
            <div className="rounded-t-xl relative h-40 bg-[--accent]">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <Image
                        src={image}
                        alt={`${name}'s profile`}
                        className="rounded-full object-cover ring-4 ring-[--card-bg]"
                        width={96}
                        height={96}
                    />
                </div>
            </div>

            <div className="pt-16 px-6 pb-6">
                <div className="text-center">
                    <StyledLink href={`/user?_id=${match_id}`} className="text-2xl font-[family-name:var(--tiempos)] font-bold mb-2">{name}</StyledLink>
                    <ExpandableText className="text-sm text-[--light] mb-4" text={bio} maxLength={100} />
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <h1 className="text-lg font-semibold mb-2">Location</h1>
                        <div className="flex items-center gap-2 text-[--light]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <span>{country === "Prefer not to say" ? "Prefer not to say" : `${city}, ${country}`}</span>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold mb-2">Social Links</h1>
                        <div className="flex flex-wrap gap-4">
                            {linkedIn && (
                                <StyledLink href={linkedIn} className="flex items-center gap-2 text-[--light]">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    LinkedIn
                                </StyledLink>
                            )}
                            {gitHub && (
                                <StyledLink href={gitHub} className="flex items-center gap-2 text-[--light]">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    GitHub
                                </StyledLink>
                            )}
                            {x && (
                                <StyledLink href={x} className="flex items-center gap-2 text-[--light]">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    X (Twitter)
                                </StyledLink>
                            )}
                            {personalWebsite && (
                                <StyledLink href={personalWebsite} className="flex items-center gap-2 text-[--light]">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    Personal Website
                                </StyledLink>
                            )}
                        </div>
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold mb-2">Skills {needHelp ? "they need" : "they have"}</h1>
                        <div className="space-y-3">
                            {skills.map((skill) => (
                                <div key={skill}>
                                    <span className="text-[--light]">{skill}</span>
                                    <SkillLevel level={skillLevels[skill]} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold mb-2">Themes {needHelp ? "of their project" : "they want to work on"}</h1>
                        <div className="flex flex-wrap gap-2">
                            {themes.map((theme) => (
                                <Badge key={theme} variant="outline">{theme}</Badge>
                            ))}
                        </div>
                    </div>

                    {!needHelp ? (
                        <div className="flex items-center gap-2 text-[--light]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Available: {availability}</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-lg font-semibold mb-2">Project Details</h1>
                                <StyledLink href={projectLink} className="text-lg font-semibold">
                                    {projectName}
                                </StyledLink>
                                <ExpandableText className="mt-2 text-sm text-[--light]" text={projectDescription} />
                            </div>

                            <div>
                                <h1 className="text-lg font-semibold mb-2">Help Needed</h1>
                                <ExpandableText className="mt-2 text-sm text-[--light]" text={helpDescription} />
                            </div>

                            <div className="flex items-center gap-2 text-[--light]">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default function ProfileCard({ user }) {
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
        <MobileProfileCard user={user} />
    ) : (
        <DesktopProfileCard user={user} />
    );
}