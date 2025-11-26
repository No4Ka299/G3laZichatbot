import { tool } from 'ai';
import { z } from 'zod';
import { fetchCyberleninka } from './fetch-cyberleninka';
import { PaymentService } from '@/lib/payment';

export const generateAcademicWork = tool({
  description: 'Generate academic works like course works and reports based on cyberleninka.ru data. This service requires payment.',
  parameters: z.object({
    topic: z.string(),
    type: z.enum(['coursework', 'report']),
    requirements: z.string().optional(),
    pages: z.number().optional().default(10),
    userId: z.string().optional(), // User ID for payment processing
  }),
  execute: async ({ topic, type, requirements, pages, userId }) => {
    try {
      // Calculate price for the academic work
      const price = PaymentService.calculatePrice(type, pages);
      
      // Process payment (in a real app, you'd validate this properly)
      if (userId) {
        const paymentRequest = {
          userId,
          amount: price,
          currency: 'RUB',
          description: `${type} on ${topic}`,
          workType: type,
          topic,
        };
        
        const paymentResult = await PaymentService.processPayment(paymentRequest);
        
        if (!paymentResult.success) {
          throw new Error(`Payment failed: ${paymentResult.error}`);
        }
        
        console.log(`Payment processed successfully for ${type} on topic: ${topic}, amount: ${price}`);
      } else {
        console.log(`Payment would be required for ${type} on topic: ${topic}, amount: ${price} (no user ID provided for actual payment)`);
      }
      
      // Fetch relevant data from cyberleninka.ru
      const cyberleninkaData = await fetchCyberleninka.execute({ topic, limit: 5 });
      
      // Generate academic work based on the fetched data
      let workType = "Course Work";
      if (type === "report") {
        workType = "Report";
      }
      
      // Create a structure for the academic work
      const academicWork = {
        title: `${topic} - ${workType}`,
        type,
        topic,
        pages,
        requirements: requirements || "Standard academic requirements",
        structure: {
          introduction: `The introduction provides background on ${topic} and outlines the purpose and objectives of this ${type}.`,
          mainBody: `The main body of this ${type} will explore various aspects of ${topic} based on research from cyberleninka.ru. This section will include analysis of different perspectives, methodologies, and findings related to the topic.`,
          conclusion: `The conclusion summarizes the key findings about ${topic} and suggests potential areas for future research.`,
        },
        sources: cyberleninkaData.results || [],
        content: `# ${topic} - ${workType}\n\n## Introduction\n${type === 'coursework' ? 'This coursework explores the topic of ' : 'This report analyzes '}${topic}. The purpose of this document is to provide comprehensive insights based on academic research.\n\n## Main Body\nBased on the research from cyberleninka.ru, we examine various aspects of ${topic}. The analysis includes:\n- Key concepts and theories\n- Current state of research\n- Critical analysis of different approaches\n- Implications and applications\n\n## Conclusion\nThis ${type} has examined ${topic} through the lens of academic research. The findings suggest important implications for the field.\n\n## References\n${cyberleninkaData.results?.map((source: any) => `- ${source.title} (${source.year}) - ${source.url}`).join('\n') || 'No sources available'}`,
      };

      return academicWork;
    } catch (error) {
      console.error('Error generating academic work:', error);
      return {
        error: 'Failed to generate academic work',
        topic,
        type,
      };
    }
  },
});