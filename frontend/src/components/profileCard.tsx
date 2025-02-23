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

function ExpandableText({ text, maxLength = 150 }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    const displayText = isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');

    return (
        <div>
            <p className="text-[--light]">{displayText}</p>
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

function DesktopProfileCard({ match }) {
    const {
        name,
        email,
        linkedIn,
        x,
        gitHub,
        personalWebsite,
        imageLink,
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
    } = match;

    return (
        <Card className="bg-[--bg] w-full rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-[--border]">
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
                            <h1 className="text-3xl font-[family-name:var(--tiempos)] font-bold text-[--text]">{name}</h1>
                        </div>
                        <ExpandableText text={bio} />
                    </div>
                </div>
            </div>

            <div className="p-8 border-b border-[--border]">
                <h2 className="text-xl font-semibold text-[--text] mb-4">Contact Information</h2>
                <div className="space-y-3">
                    {/* {email && (
                        <div className="flex items-center gap-2 text-[--light]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{email}</span>
                        </div>
                    )} */}

                    <div className="flex items-center gap-2 text-[--light]">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                        </svg>
                        <StyledLink href={linkedIn}>LinkedIn</StyledLink>
                    </div>

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
                        <h2 className="text-xl font-semibold text-[--text] mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <Badge key={skill}>{skill}</Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-[--text] mb-4">Themes</h2>
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
                            <h2 className="text-xl font-semibold text-[--text] mb-4">Project Details</h2>
                            <StyledLink href={projectLink} className="text-lg font-bold hover:text-[--accent]">
                                {projectName}
                            </StyledLink>
                            <ExpandableText text={projectDescription} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-[--text] mb-4">Help Needed</h2>
                            <ExpandableText text={helpDescription} />
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

function MobileProfileCard({ match }) {
    const {
        name,
        email,
        linkedIn,
        x,
        gitHub,
        personalWebsite,
        imageLink,
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