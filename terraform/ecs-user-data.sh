#!/bin/bash
echo ECS_CLUSTER=rbh-web-production >> /etc/ecs/ecs.config
yum install -y ec2-instance-connect