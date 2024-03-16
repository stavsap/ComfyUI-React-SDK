import axios from 'axios';

export interface Root {
    CheckpointLoaderSimple: CheckpointLoaderSimple
}

export interface Input {
    required: Required
}

export interface Required {
    ckpt_name: string[][]
}

export interface CheckpointLoaderSimple {
    input: Input
    output: string[]
    output_is_list: boolean[]
    output_name: string[]
    name: string
    display_name: string
    description: string
    category: string
    output_node: boolean
}

export   function  getCheckpoints(){
    axios.get<Root>('object_info/CheckpointLoaderSimple', {
        headers: {
    'Content-Type': 'application/json'
}
    }).then(res=>{
        console.log(res.data.CheckpointLoaderSimple.input.required.ckpt_name)
    });
}

// #This is the ComfyUI api prompt format.
//
//     #If you want it for a specific workflow you can "enable dev mode options"
// #in the settings of the UI (gear beside the "Queue Size: ") this will enable
// #a button on the UI to save workflows in api format.
//
//     #keep in mind ComfyUI is pre alpha software so this format will change a bit.
//
//     #this is the one for the default workflow
export function  Generate(){
    let prompt_text =
        {
            "3": {
                "class_type": "KSampler",
                "inputs": {
                    "cfg": 3,
                    "denoise": 1,
                    "latent_image": [
                        "5",
                        0
                    ],
                    "model": [
                        "4",
                        0
                    ],
                    "negative": [
                        "7",
                        0
                    ],
                    "positive": [
                        "6",
                        0
                    ],
                    "sampler_name": "euler",
                    "scheduler": "normal",
                    "seed": Math.round(Math.random()*100000),
                    "steps": 5
                }
            },
            "4": {
                "class_type": "CheckpointLoaderSimple",
                "inputs": {
                    "ckpt_name": "DreamShaperXL_Turbo_v2_1.safetensors"
                }
            },
            "5": {
                "class_type": "EmptyLatentImage",
                "inputs": {
                    "batch_size": 1,
                    "height": 1024,
                    "width": 1024
                }
            },
            "6": {
                "class_type": "CLIPTextEncode",
                "inputs": {
                    "clip": [
                        "4",
                        1
                    ],
                    "text": "masterpiece best quality fish"
                }
            },
            "7": {
                "class_type": "CLIPTextEncode",
                "inputs": {
                    "clip": [
                        "4",
                        1
                    ],
                    "text": "bad hands"
                }
            },
            "8": {
                "class_type": "VAEDecode",
                "inputs": {
                    "samples": [
                        "3",
                        0
                    ],
                    "vae": [
                        "4",
                        2
                    ]
                }
            },
            "9": {
                "class_type": "SaveImage",
                "inputs": {
                    "filename_prefix": "ComfyUI",
                    "images": [
                        "8",
                        0
                    ]
                }
            }
        };

    queue_prompt(prompt_text).then(res=>{
        console.log(res)
    })
}

// Queue a prompt
async function queue_prompt(prompt = {}) {
    const data = { 'prompt': prompt, 'client_id': "1122"};

    const response = await fetch('/prompt', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}


