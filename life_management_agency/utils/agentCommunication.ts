import { spawn } from 'child_process';
import path from 'path';

interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function communicateWithAgent(
  agentType: 'health' | 'lifestyle',
  action: string,
  params: Record<string, any> = {}
): Promise<AgentResponse> {
  // Check if we should use mock data
  const agentMode = process.env.AGENT_MODE || 'mock';
  
  if (agentMode === 'mock') {
    console.log(`Using mock data for ${agentType} agent`);
    return {
      success: true,
      data: getMockData(agentType, action)
    };
  }

  try {
    // Use virtual environment's Python interpreter
    const pythonPath = path.resolve(process.cwd(), 'venv', 'Scripts', 'python.exe');
    const sitePackagesPath = path.resolve(process.cwd(), 'venv', 'Lib', 'site-packages');
    
    // Get agent script path - using absolute path without duplication
    const agentPath = path.resolve(
      process.cwd(),
      'life_management_agency',
      agentType === 'health' ? 'health_agent' : 'lifestyle_agent',
      `${agentType}_agent.py`
    );

    // Convert params to command line arguments
    const args = [
      '-c',
      `import os; os.environ['OPENAI_API_KEY'] = '${process.env.OPENAI_API_KEY}'; import sys; sys.path.insert(0, '${process.cwd()}'); from life_management_agency.${agentType}_agent.${agentType}_agent import ${agentType === 'health' ? 'HealthAgent' : 'LifestyleAgent'}; agent = ${agentType === 'health' ? 'HealthAgent' : 'LifestyleAgent'}(); print(agent.${action}(${params ? JSON.stringify(params) : ''}))`
    ];

    console.log('Python executable:', pythonPath);
    console.log('Python args:', args);
    console.log('Working directory:', process.cwd());
    console.log('Environment:', {
      PYTHONPATH: sitePackagesPath,
      PATH: process.env.PATH,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '[REDACTED]' : undefined
    });

    const pythonProcess = spawn(pythonPath, args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PYTHONPATH: sitePackagesPath,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY
      },
      shell: true // Use shell to handle Windows paths
    });

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
      console.log('Python stdout:', data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error('Python stderr:', data.toString());
    });

    return new Promise((resolve) => {
      pythonProcess.on('close', (code) => {
        console.log('Python process exited with code:', code);
        console.log('Output data:', outputData);
        console.log('Error data:', errorData);

        if (code !== 0) {
          // Check if error indicates no user data
          if (errorData.includes('No user data found')) {
            resolve({
              success: false,
              error: 'No user data found. Please complete setup.'
            });
          } else {
            resolve({
              success: false,
              error: `Agent process failed: ${errorData || 'Unknown error'}`
            });
          }
        } else {
          try {
            const parsedData = JSON.parse(outputData);
            resolve({
              success: true,
              data: parsedData
            });
          } catch (error: any) {
            resolve({
              success: false,
              error: `Failed to parse agent response: ${error?.message || 'Unknown error'}\nOutput: ${outputData}`
            });
          }
        }
      });
    });
  } catch (error: any) {
    console.error('Agent Communication Error:', error);
    return {
      success: false,
      error: `Failed to communicate with agent: ${error?.message || 'Unknown error'}`
    };
  }
}

function getMockData(agentType: 'health' | 'lifestyle', action: string) {
  if (agentType === 'health') {
    return {
      fitness: {
        steps: 8432,
        activeMinutes: 45,
        heartRate: 72,
        sleepHours: 7.5
      },
      cognitive: {
        focusScore: 85,
        stressLevel: 3,
        mindfulnessMinutes: 15
      },
      recommendations: [
        {
          type: 'exercise',
          title: 'Afternoon Walk',
          description: 'Take a 20-minute walk to reach your daily step goal',
          priority: 1
        }
      ],
      dailyGoals: [
        {
          type: 'steps',
          target: 10000,
          current: 8432,
          unit: 'steps'
        }
      ]
    };
  } else {
    return {
      tasks: [
        {
          id: '1',
          title: 'Morning Routine',
          description: 'AI-optimized morning routine for peak productivity',
          priority: 1,
          dueDate: new Date().toISOString(),
          status: 'pending'
        },
        {
          id: '2',
          title: 'Team Meeting',
          description: 'Weekly sync with development team',
          priority: 2,
          dueDate: new Date().toISOString(),
          status: 'pending'
        }
      ],
      events: [
        {
          id: '1',
          title: 'Focus Time',
          startTime: '09:00',
          endTime: '11:00',
          type: 'productivity'
        }
      ],
      productivity: {
        focusTime: 120,
        tasksCompleted: 5,
        efficiency: 0.85
      }
    };
  }
}
