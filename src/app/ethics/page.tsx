'use client';

import Container from '@/components/ui/Container';
import styles from '../privacy/privacy.module.css';

export default function EthicsConsentPage() {
    return (
        <div className={styles.container}>
            <Container>
                <div className={styles.content}>
                    <h1 className={styles.title}>Ethics & Consent</h1>
                    <p className={styles.updated}>Institutional Review Board Approved</p>

                    <section className={styles.section}>
                        <h2>1. Ethical Framework</h2>
                        <p>
                            The SMART-ASD Platform operates under strict ethical guidelines approved by our Institutional Review Board (IRB). All research activities comply with:
                        </p>
                        <ul>
                            <li>The Declaration of Helsinki</li>
                            <li>Good Clinical Practice (GCP) guidelines</li>
                            <li>National and international data protection regulations</li>
                            <li>Ethical principles of beneficence, non-maleficence, and justice</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Informed Consent Process</h2>
                        <p>
                            Before participating in any research activity, you (or your child's guardian) will receive:
                        </p>
                        <ul>
                            <li>A detailed explanation of the study purpose and procedures</li>
                            <li>Information about potential risks and benefits</li>
                            <li>Assurance of voluntary participation and right to withdraw</li>
                            <li>Contact information for questions or concerns</li>
                            <li>Time to review and ask questions before signing</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Participant Rights</h2>
                        <h3>You have the right to:</h3>
                        <ul>
                            <li><strong>Voluntary Participation:</strong> Participation is entirely voluntary</li>
                            <li><strong>Withdraw at Any Time:</strong> You may withdraw without penalty or loss of benefits</li>
                            <li><strong>Confidentiality:</strong> Your identity will be protected in all publications</li>
                            <li><strong>Access to Results:</strong> You may request a summary of research findings</li>
                            <li><strong>Ask Questions:</strong> Contact the research team at any time</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Vulnerable Populations</h2>
                        <p>
                            Special protections are in place for children and individuals with developmental disabilities:
                        </p>
                        <ul>
                            <li>Parental/guardian consent required for minors</li>
                            <li>Assent obtained from children when developmentally appropriate</li>
                            <li>Additional safeguards for participants unable to provide consent</li>
                            <li>Ongoing monitoring for signs of distress or discomfort</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Data Use & Anonymization</h2>
                        <p>
                            Research data is handled with the highest ethical standards:
                        </p>
                        <ul>
                            <li>Personal identifiers removed from research datasets</li>
                            <li>Data aggregated for statistical analysis</li>
                            <li>No individual participants identifiable in publications</li>
                            <li>Secure storage with restricted access</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Potential Risks & Benefits</h2>
                        <h3>Potential Risks:</h3>
                        <ul>
                            <li>Minimal psychological discomfort during assessments</li>
                            <li>Time commitment for screening and follow-up</li>
                            <li>Breach of confidentiality (mitigated by security measures)</li>
                        </ul>
                        <h3>Potential Benefits:</h3>
                        <ul>
                            <li>Access to structured behavioral assessments</li>
                            <li>Contribution to autism research</li>
                            <li>Potential early identification and intervention</li>
                            <li>Connection to therapeutic resources</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>7. Compensation</h2>
                        <p>
                            Participants may receive compensation for their time and travel expenses as outlined in the specific study protocol. Compensation is not contingent on study completion.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>8. Contact for Ethical Concerns</h2>
                        <p>
                            If you have concerns about the ethical conduct of this research or questions about participation:
                        </p>
                        <p>
                            <strong>Email:</strong> smartasdplatform@gmail.com
                        </p>
                    </section>
                </div>
            </Container>
        </div>
    );
}
