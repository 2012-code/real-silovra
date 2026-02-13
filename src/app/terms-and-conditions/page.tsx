
import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[--color-zenith-space] text-[--color-zenith-white] p-6 md:p-12 font-sans selection:bg-[--color-zenith-indigo] selection:text-white">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Section */}
                <header className="space-y-4 border-b border-[--color-zenith-border] pb-8">
                    <Link href="/" className="inline-block text-[--color-zenith-indigo] hover:text-[--color-zenith-violet] transition-colors mb-4 text-sm font-medium tracking-wide">
                        &larr; Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[--color-zenith-indigo] to-[--color-zenith-violet]">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-400">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </header>

                {/* Content Section */}
                <main className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-[--color-zenith-white] mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Ultra Links ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[--color-zenith-white] mb-4">2. Use License</h2>
                        <p className="mb-4">
                            Permission is granted to temporarily download one copy of the materials (information or software) on Ultra Links's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-[--color-zenith-indigo]">
                            <li>Modify or copy the materials;</li>
                            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li>Attempt to decompile or reverse engineer any software contained on Ultra Links's website;</li>
                            <li>Remove any copyright or other proprietary notations from the materials; or</li>
                            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[--color-zenith-white] mb-4">3. Disclaimer</h2>
                        <p>
                            The materials on Ultra Links's website are provided on an 'as is' basis. Ultra Links makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[--color-zenith-white] mb-4">4. Limitations</h2>
                        <p>
                            In no event shall Ultra Links or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ultra Links's website, even if Ultra Links or a Ultra Links authorized representative has been notified orally or in writing of the possibility of such damage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[--color-zenith-white] mb-4">5. Accuracy of Materials</h2>
                        <p>
                            The materials appearing on Ultra Links's website could include technical, typographical, or photographic errors. Ultra Links does not warrant that any of the materials on its website are accurate, complete or current. Ultra Links may make changes to the materials contained on its website at any time without notice. However Ultra Links does not make any commitment to update the materials.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[--color-zenith-white] mb-4">6. Links</h2>
                        <p>
                            Ultra Links has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Ultra Links of the site. Use of any such linked website is at the user's own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[--color-zenith-white] mb-4">7. Modifications</h2>
                        <p>
                            Ultra Links may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[--color-zenith-white] mb-4">8. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-[--color-zenith-border] mt-12">
                        <p className="text-sm text-gray-500">
                            If you have any questions about these Terms, please contact us at support@ultralinks.com.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
