---
title: 'Spring Boot 集成 Quartz 任务处理'
date: '2019-05-15'
spoiler: Spring Boot 集成 Quartz 任务处理，详细介绍了 Quartz 的各种策略
---


Spring 框架自带定时任务功能，虽然看上去挺简单的，但是也能处理大部分日常的任务了。 如果想要对任务处理有更多的控制，更多的自定义的东西，那么可以考虑使用 Quartz， 如果想要有分布式处理的能力，可以使用 elastic job。 本文介绍如何集成 Spring Boot 和 Quartz

## 安装 maven 依赖

```xml
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
    <version>2.3.0</version>
</dependency>
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz-jobs</artifactId>
    <version>2.3.0</version>
</dependency>

```

## 集成 Spring 依赖注入

首先，接入 Spring 当然需要让定义的 Job 能支持 Autowire，不然接入有什么意义。 这里通过实现 ApplicationContextAware 接口，拿到 AutowireCapableBeanFactory, 再通过这个 Factory 去 Autowire Job 实例

```java

/**
 * Adds auto-wiring support to quartz jobs.
 * @see "https://gist.github.com/jelies/5085593"
 */
@Configuration
public class AutowiringSpringBeanJobFactory extends SpringBeanJobFactory implements ApplicationContextAware {

    private transient AutowireCapableBeanFactory beanFactory;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        beanFactory = applicationContext.getAutowireCapableBeanFactory();
    }

    @Override
    protected Object createJobInstance(TriggerFiredBundle bundle) throws Exception {
        final Object job = super.createJobInstance(bundle);
        beanFactory.autowireBean(job);

        return job;
    }
}
```

这个是配置了一些 Quartz 属性，

```java
@Configuration
public class SchedulerConfig {

    @Autowired
    DataSource dataSource;

    @Bean
    public JobFactory jobFactory(ApplicationContext applicationContext) {
        AutowiringSpringBeanJobFactory jobFactory = new AutowiringSpringBeanJobFactory();
        jobFactory.setApplicationContext(applicationContext);
        return jobFactory;
    }

    @Bean
    public SchedulerFactoryBean schedulerFactoryBean(JobFactory jobFactory)
        throws IOException {
        SchedulerFactoryBean factoryBean = new SchedulerFactoryBean();
        factoryBean.setOverwriteExistingJobs(true);
        factoryBean.setJobFactory(jobFactory);
        factoryBean.setDataSource(dataSource);
        factoryBean.setStartupDelay(2);
        factoryBean.setAutoStartup(true);

        factoryBean.setApplicationContextSchedulerContextKey("applicationContext");

        factoryBean.setQuartzProperties(quartzProperties());

        return factoryBean;
    }


    @Bean
    public Properties quartzProperties() throws IOException {
        PropertiesFactoryBean propertiesFactoryBean = new PropertiesFactoryBean();

        propertiesFactoryBean.setLocation( new ClassPathResource("/quartz.properties"));
        propertiesFactoryBean.afterPropertiesSet();
        return propertiesFactoryBean.getObject();
    }
}

```

## Quartz 的处理策略

### Simple trigger without repeating

1. smart policy - default
   这是默认策略，等同于 第 2 条
2. withMisfireHandlingInstructionFireNow
   如果计划是 2 点执行，但是但是由于各种原因没有执行，比如进程被停了，那么当进程 3 点钟起来的时候，会被立即执行。
3. withMisfireHandlingInstructionIgnoreMisfires
   等同于第 2 条
4. withMisfireHandlingInstructionNextWithExistingCount
   等同于第 5 条
5. withMisfireHandlingInstructionNextWithRemainingCount
   如果 job 错过执行，直接忽略.
6. withMisfireHandlingInstructionNowWithExistingCount
   同第 2 条
7. withMisfireHandlingInstructionNowWithRemainingCount
   同第 2 条

### Simple trigger with repeating

1. smart policy - default
   这是默认策略，等同于第 5 条
2. withMisfireHandlingInstructionFireNow
   等同于第 5 条
3. withMisfireHandlingInstructionIgnoreMisfires
   会立刻执行所有错过的 Job，
4. withMisfireHandlingInstructionNextWithExistingCount
   错过的任务，会被重新执行
5. withMisfireHandlingInstructionNextWithRemainingCount
   错过执行的任务，都会被丢弃。剩下的任务继续执行
6. withMisfireHandlingInstructionNowWithExistingCount
   立即开始执行，同时更具当前时间重新计算 job internal 时间
7. withMisfireHandlingInstructionNowWithRemainingCount
   错过的任务只会被执行一次，即使有错过多次。剩下的任务继续执行。

### CRON Triggers

1. smart policy - default
   这是默认策略，等同于第 3 条
2. withMisfireHandlingInstructionIgnoreMisfires
   错过了的任务会被立即执行，如果错过了三次，那这三次立刻同时执行。然后继续等待下一个 schedule
3. withMisfireHandlingInstructionFireAndProceed
   错过的任务会被执行一次，不论错过了多少次。 然后继续等待下一个 schedule
4. withMisfireHandlingInstructionDoNothing
   错过了就错过了，继续等待下一个 schedule