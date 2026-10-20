# Apache Kafka, Explained in 2 Minutes: Script

**Title:** Apache Kafka, Explained in 2 Minutes

**Series:** Explained in 2 Minutes, episode 02

**Spoken words:** 249 · **Voice:** 1:24 · **Video:** 1:49 (opening card, the problem as the hook, channel intro, the rest of the episode, comment ask)

**Format:** the same as episode 01: both cuts (landscape for YouTube, portrait for TikTok, Reels and Shorts), the "Crispus Roshan" voice, the 120 BPM beat, word-by-word captions in the portrait cut, and each cut opening on its thumbnail. The delivery tag is `[confident]` instead of `[calm]`, to keep the energy up.

**Status:** approved, recorded (take 4 of 4) and built. Both cuts are in `stackle-video/graphics/` (`kafka-explained.mp4`, `kafka-explained-vertical.mp4`). The opening cards are temporary until Chris's thumbnails arrive.

---

## Script

> [confident] Every time you tap "order" in an app, that tap becomes an event. The payment service needs it. The warehouse needs it. Analytics needs it. All of them, right now. Wiring every service to every other one turns into spaghetti. So a lot of companies put Apache Kafka in the middle.
>
> Kafka is an open-source platform for streaming events. Streaming just means data flows the moment it happens, not in a nightly batch. It started at LinkedIn, and became a top-level Apache project in 2012.
>
> Here's the core idea. Producers write events to a topic. A topic is just a named log, like "orders". New events go on the end, and Kafka keeps them for as long as you choose. Consumers read that log at their own pace, and remember their place with a number called an offset.
>
> Now, the architecture. A Kafka cluster is a group of servers called brokers. Each topic is split into partitions, spread across the brokers, so many machines share the load. Every partition is copied to other brokers, so if one fails, the data is still there. Consumers join a consumer group, and each partition goes to one member, so you scale by adding consumers. And a few controllers, running KRaft, keep track of which broker leads each partition.
>
> [warmly] So when a team says, "we use Kafka," it means their services don't call each other. They publish events once, and anyone who needs them can read them, as they happen. That's Apache Kafka.

## What is on screen

| Part | Words | Picture |
|---|---|---|
| Opening card | (beat only) | The Kafka thumbnail (16:9 and 9:16). A temporary design for now |
| The problem | "Every time you tap 'order' …" | A phone taps "Order". Arrows fan out to Payments, Warehouse and Analytics, then multiply into a tangle of service-to-service lines |
| Channel intro | "Hi, I'm Chris …" | The Stackle intro (12.9 s), straight after the hook |
| What it is | "Kafka is an open-source platform …" | The tangle collapses into one Kafka bar in the middle. Then "batch vs streaming" (a nightly clock vs a live flow) and a timeline: 2011 LinkedIn, 2012 top-level Apache project |
| The core idea | "Producers write events to a topic …" | An `orders` log builds from left to right with numbered events. Producers append on the right, and two consumers read at different points, each with its own offset marker |
| Architecture | "A Kafka cluster is a group of servers …" | Three broker cards. The topic splits into partitions P0, P1 and P2 spread across them, with leader and replica copies. One broker fails, its replica takes over, and nothing goes dark. A consumer group of three picks up one partition each. A small KRaft controller quorum sits on top, pointing at each leader |
| In short | "So when a team says …" | "We use Kafka." Takeaways: services don't call each other · they publish each event once · anyone who needs it reads it, as it happens. Then the closing title |
| Comment ask | "So, what should I explain next? …" | A comment box types out ideas until "comments" presses its button |

## Facts to check before recording

| Claim | Source |
|---|---|
| Kafka was built at LinkedIn (Jay Kreps, Neha Narkhede, Jun Rao) and open-sourced in early 2011 | [Wikipedia: Apache Kafka](https://www.Wikipedia.com/wiki/Apache_Kafka) |
| It graduated from the Apache Incubator to a top-level project on 23 October 2012 | Same page |
| Since Kafka 4.0 (March 2025), clusters run only in KRaft mode, and ZooKeeper has been removed | [Kafka 4.0 release announcement](https://kafka.apache.org/blog/2025/03/18/apache-kafka-4.0.0-release-announcement/), [4.0 upgrade notes](https://kafka.apache.org/40/getting-started/upgrade/) |
| Retention is set per topic (by time or size, or kept forever) | Kafka docs, topic configuration (`retention.ms`, `retention.bytes`) |
| Within a consumer group, each partition is read by exactly one member | Kafka docs, consumer groups |

**Kept simple on purpose:** order is guaranteed within a partition, not across a whole topic, so the recap says "as they happen" rather than "in order". "Copied to other brokers" assumes a replication factor above 1, which is the norm in production.
