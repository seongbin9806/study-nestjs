import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface PostModel {
    id: number;
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
}

let posts: PostModel[] = [
    {
        id: 1,
        author: 'newjeans_official',
        title: '뉴진스 민지',
        content: '메이크업 고치고 있는 민지',
        likeCount: 10000000,
        commentCount: 999999,
    },
    {
        id: 2,
        author: 'newjeans_official',
        title: '뉴진스 해린',
        content: '노래 연습 하고 있는 해린',
        likeCount: 10000000,
        commentCount: 999999,
    },
    {
        id: 3,
        author: 'newjeans_official',
        title: '뉴진스 민지',
        content: '메이크업 고치고 있는 민지',
        likeCount: 10000000,
        commentCount: 999999,
    },
];


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>
    ){}

    async getAllPosts() {
        return this.postsRepository.find({
            relations: {
                author: true,
            }
        });
    }

    async getPostById(id: number) {
        const post = await this.postsRepository.findOne({
            where:{
                id
            },
            relations: {
                author: true,
            }
        });

        if(!post){
            throw new NotFoundException();
        }

        return post;
    }

    async createPost(authorId: number, title: string, content: string) {

        const post = this.postsRepository.create({
            author:{
                id: authorId,
            },
            title,
            content,
            likeCount: 0,
            commentCount: 0,
        });

        const newPost = await this.postsRepository.save(post);

        return newPost;
    }

    async updatePost(postId: number, title: string, content: string) {

        const post = await this.postsRepository.findOne({
            where: {
                id: postId
            }
        });

        if (!post) {
            throw new NotFoundException();
        }

        if (title) {
            post.title = title;
        }

        if (content) {
            post.content = content;
        }

        const newPost = await this.postsRepository.save(post);
        
        return newPost;
    }

    async deletePost(postId: number) {
        const post = await this.postsRepository.findOne({
            where: {
                id: postId
            }
        });

        if (!post) {
            throw new NotFoundException();
        }

        await this.postsRepository.delete(postId);
        
        return postId;
    }
}
