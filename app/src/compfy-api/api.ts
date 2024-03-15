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
